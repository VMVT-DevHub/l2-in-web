'use client';

import { FieldWrapper } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';
import { TreeSelect } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import type React from 'react';
import styled from 'styled-components';
import Icon, { IconName } from '../components/Icons';
import { formatError } from '../utils/functions';
import api, { AnimalNode, SearchNode } from '../utils/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface TreeNode {
  value: string;
  title: string | React.ReactNode;
  isLeaf: boolean;
  selectable: boolean;
  displ?: string;
  rawData: AnimalNode;
  children?: TreeNode[];
}

interface SelectedAnimal {
  code?: string;
  name?: string;
  displ?: string;
  layer?: number;
  codes?: string[];
  names?: string[];
}

const LT_MAP: Record<string, string> = {
  ą: 'a',
  č: 'c',
  ę: 'e',
  ė: 'e',
  į: 'i',
  š: 's',
  ų: 'u',
  ū: 'u',
  ž: 'z',
  Ą: 'A',
  Č: 'C',
  Ę: 'E',
  Ė: 'E',
  Į: 'I',
  Š: 'S',
  Ų: 'U',
  Ū: 'U',
  Ž: 'Z',
};

const toTreeNode = (animal: AnimalNode, highlight?: string): TreeNode => ({
  value: animal.code,
  title: highlight ? highlightText(animal.name, highlight) : animal.name,
  isLeaf: animal.last,
  selectable: true,
  displ: animal.displ,
  rawData: animal,
  children: animal.last ? undefined : [],
});

function highlightText(text: string, query: string): React.ReactNode {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <HighlightMark>{text.slice(idx, idx + query.length)}</HighlightMark>
      {text.slice(idx + query.length)}
    </>
  );
}

const appendChildrenToTree = (
  nodes: TreeNode[],
  parentCode: string,
  children: TreeNode[],
): TreeNode[] =>
  nodes.map((node) => {
    if (node.value === parentCode) {
      return { ...node, children };
    }
    if (node.children?.length) {
      return {
        ...node,
        children: appendChildrenToTree(node.children, parentCode, children),
      };
    }
    return node;
  });

const findNode = (nodes: TreeNode[], code: string): TreeNode | null => {
  for (const n of nodes) {
    if (n.value === code) return n;
    if (n.children) {
      const found = findNode(n.children, code);
      if (found) return found;
    }
  }
  return null;
};

const mergeSearchIntoTree = (base: TreeNode[], results: SearchNode, query: string): TreeNode[] => {
  // Deep-clone the base so we don't mutate state
  const clone = (nodes: TreeNode[]): TreeNode[] =>
    nodes.map((n) => ({ ...n, children: n.children ? clone(n.children) : undefined }));

  const tree = clone(base);

  for (const animal of results.data) {
    // Build ancestor chain from codes/names (index 0 = root … last = self)
    const codes: string[] = animal.codes ?? [animal.code];
    const names: string[] = animal.names ?? [animal.name];

    let currentLevel = tree;
    for (let i = 0; i < codes.length; i++) {
      const code = codes[i];
      const name = names[i] ?? code;
      const isLast = i === codes.length - 1;

      let existing = currentLevel.find((n) => n.value === code);

      if (!existing) {
        // Inject placeholder node
        const placeholder: TreeNode = {
          value: code,
          title: isLast ? highlightText(name, query) : name,
          isLeaf: isLast ? animal.last : false,
          selectable: true,
          displ: isLast ? animal.displ : undefined,
          rawData: isLast ? animal : { code, name, layer: i, last: false },
          children: isLast && animal.last ? undefined : [],
        };
        currentLevel.push(placeholder);
        existing = placeholder;
      } else if (isLast) {
        // Node already exists — just apply highlight
        existing.title = highlightText(existing.rawData.name, query);
      }

      // Ensure children array exists for non-leaf nodes so they're expandable
      if (!existing.isLeaf && !existing.children) {
        existing.children = [];
      }

      currentLevel = existing.children ?? [];
    }
  }

  return tree;
};

export const AsyncAnimalTreeSelectRenderer = ({
  data,
  handleChange,
  path,
  label,
  errors,
  enabled,
  visible,
}: ControlProps) => {
  const queryClient = useQueryClient();
  const normalizeLt = (text: string): string =>
    text.replace(/[ąčęėįšųūžĄČĘĖĮŠŲŪŽ]/g, (ch) => LT_MAP[ch] ?? ch);

  // Full, always-present tree (root + lazily loaded branches)
  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  // Merged view used when a search query is active
  const [searchTreeData, setSearchTreeData] = useState<TreeNode[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSearchResults = useRef<SearchNode | null>(null);

  const { data: rootData, isLoading } = useQuery({
    queryKey: ['animalRoot'],
    queryFn: api.getAnimalRoot,
  });

  useEffect(() => {
    if (rootData) {
      setTreeData(rootData.childs.map((a: AnimalNode) => toTreeNode(a)));
    }
  }, [rootData]);

  const onLoadData = useCallback(
    async (node: any): Promise<void> => {
      const code = node.value as string;

      if ((node.children as TreeNode[] | undefined)?.length) return;

      const animals = await queryClient.fetchQuery({
        queryKey: ['animalGroup', code],
        queryFn: () => api.getAnimalGroup(code),
      });

      const children = animals.childs.map((a: AnimalNode) => toTreeNode(a));

      setTreeData((prev) => appendChildrenToTree(prev, code, children));

      if (isSearching) {
        setSearchTreeData((prev) => appendChildrenToTree(prev, code, children));
      }
    },
    [queryClient, isSearching],
  );

  const onSearch = useCallback(
    (value: string) => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);

      if (!value || value.trim().length < 2) {
        setIsSearching(false);
        setSearchQuery('');
        setSearchTreeData([]);
        return;
      }

      const trimmed = value.trim();
      const normalized = normalizeLt(trimmed);

      setIsSearching(true);
      setSearchQuery(normalized);
      setSearchLoading(true);

      searchTimeout.current = setTimeout(async () => {
        try {
          const animals = await queryClient.fetchQuery({
            queryKey: ['animalGroupSearch', normalized],
            queryFn: () => api.SearchAnimalGroup(normalized),
          });
          lastSearchResults.current = animals;
          setSearchTreeData(mergeSearchIntoTree(treeData, animals, trimmed));
          // Merge results into a copy of the current full tree so that
          // ancestor nodes are already present and expandable.
        } catch (err) {
          console.error(err);
        } finally {
          setSearchLoading(false);
        }
      }, 0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [queryClient, treeData],
  );

  // Re-run merge whenever base treeData changes while a search is active
  // (e.g. a branch was lazy-loaded from a search result expansion)
  useEffect(() => {
    if (!isSearching || !searchQuery || !lastSearchResults.current) return;
    setSearchTreeData(mergeSearchIntoTree(treeData, lastSearchResults.current, searchQuery));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeData]);

  const onDropdownVisibleChange = useCallback((open: boolean) => {
    if (!open) {
      setIsSearching(false);
      setSearchQuery('');
      setSearchTreeData([]);
      lastSearchResults.current = null;
    }
  }, []);

  const findPath = (
    nodes: TreeNode[],
    target: string,
    path: TreeNode[] = [],
  ): TreeNode[] | null => {
    for (const node of nodes) {
      const newPath = [...path, node];

      if (node.value === target) return newPath;

      if (node.children) {
        const result = findPath(node.children, target, newPath);
        if (result) return result;
      }
    }
    return null;
  };

  const onChange = useCallback(
    (val: unknown, _label: React.ReactNode[], _extra: any) => {
      if (!val) {
        handleChange(path, undefined);
        return;
      }

      const code = val as string;
      const activeData = isSearching ? searchTreeData : treeData;
      const node = findNode(activeData, code);
      const raw = node?.rawData;

      const pathNodes = findPath(activeData, code);

      const selected: SelectedAnimal = {
        code,
        name: raw?.name ?? code,
        displ: raw?.displ ?? (typeof node?.title === 'string' ? node.title : code),
        layer: raw?.layer,
        codes: raw?.codes ?? pathNodes?.map((n) => n.value),
        names: raw?.names ?? pathNodes?.map((n) => n.rawData.name),
      };
      handleChange(path, selected);
    },
    [handleChange, path, isSearching, searchTreeData, treeData],
  );

  if (!visible) return <></>;

  const displayValue: string | undefined = data ? (data as SelectedAnimal).name ?? data : undefined;

  const activeTreeData = isSearching ? searchTreeData : treeData;
  const showSpinner = isLoading || searchLoading;

  return (
    <TreeSelectContainer>
      <RelativeFieldWrapper error={formatError(errors)} showError={true} label={label}>
        <StyledTreeSelect
          disabled={!enabled}
          value={displayValue}
          error={!!errors}
          treeData={activeTreeData}
          loadData={onLoadData} // always active
          style={{ width: '100%' }}
          suffixIcon={showSpinner ? <LoadingDot /> : <StyledIcon name={IconName.dropdownArrow} />}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          fieldNames={{
            label: 'title',
            value: 'value',
            children: 'children',
          }}
          showSearch
          onSearch={onSearch}
          filterTreeNode={false}
          treeNodeFilterProp="title"
          onChange={onChange}
          onOpenChange={onDropdownVisibleChange}
          treeLine
          treeDefaultExpandAll={false}
          notFoundContent={searchLoading ? 'Ieškoma...' : isSearching ? 'Gyvūnų nerasta' : null}
          allowClear
          onClear={() => handleChange(path, undefined)}
        />
      </RelativeFieldWrapper>
    </TreeSelectContainer>
  );
};

const TreeSelectContainer = styled.div`
  height: 100%;
  overflow: hidden;
`;

const RelativeFieldWrapper = styled(FieldWrapper)`
  position: relative;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const StyledIcon = styled(Icon)`
  color: #cdd5df;
  font-size: 2.4rem;
`;

const LoadingDot = styled.div`
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 50%;
  border: 2px solid #cdd5df;
  border-top-color: #6c7a8d;
  animation: spin 0.7s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const HighlightMark = styled.mark`
  background: #fff3cd;
  color: inherit;
  padding: 0;
  border-radius: 2px;
`;

const StyledTreeSelect = styled(TreeSelect)<{ error: boolean }>`
  margin-bottom: 8px;

  .ant-select-arrow {
    display: relative;
    top: 20px;
  }

  .ant-select-selector,
  .ant-select-selection-search-input {
    min-height: ${({ theme }) => `${theme.height?.fields || 5.6}rem`} !important;
    padding: 0px 12px !important;
    font-size: ${({ theme }) => theme.fontSize?.fields || 1.6}rem;
    display: flex;
    align-items: center;
  }

  .ant-select {
    transition: none !important;
  }

  .ant-select-selector {
    border: 1px solid ${({ theme, error }) => (error ? theme.colors.danger : '#d4d5de')} !important;
    border-radius: ${({ theme }) => theme.radius?.fields || 0.4}rem !important;
    background-color: ${({ theme }) => theme.colors.fields?.background || 'white'};
    color: ${({ theme }) => theme.colors.fields?.text || '#101010'};
  }

  .ant-select-selection-overflow-item {
    padding-top: 4px;
  }

  .ant-select-selector,
  .ant-select-disabled {
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    opacity: ${({ disabled }) => (disabled ? 0.48 : 1)};
    background: white !important;
  }

  .ant-select-clear {
    margin: 0px 25px 5px 0;
  }

  .ant-select-selector:focus-within {
    border-color: ${({ theme }) =>
      theme.colors.fields?.borderFocus || theme.colors.fields?.border || '#d4d5de'} !important;
    box-shadow: ${({ theme }) =>
      theme.colors.fields?.borderFocus
        ? `0 0 0 0px ${theme.colors.fields.borderFocus}33`
        : 'none'} !important;
    outline: none !important;
    animation-duration: 0s !important;
    transition: none !important;
  }
`;
