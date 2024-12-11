import { FieldWrapper } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';
import { TreeSelect } from 'antd';
import { useMemo } from 'react';
import styled from 'styled-components';
import Icon, { IconName } from '../components/Icons';
import { formatLabel } from '../utils/functions';
import { useOptions } from '../utils/hooks';

export const TreeSelectFieldRenderer = ({
  data,
  handleChange,
  path,
  label,
  schema,
  uischema,
  errors,
  enabled,
  visible,
}: ControlProps) => {
  if (!visible) return <></>;

  const options = useOptions({ schema, uischema });
  const { value, valueKey, parentKey } = uischema?.options || {};

  // The functions findTopLevelParent, modifyTreeValues, and formatValue are temporary
  // workarounds to handle issues with duplicate child/parent IDs in the options, which React
  // does not support due to its restrictions on unique keys. These functions ensure the
  // proper handling of tree data despite these limitations. This is a short-term solution, as a
  // custom Tree Select component will soon be developed as part of our design library. The
  // new component will not only resolve these issues but also significantly improve
  // performance.

  const findTopLevelParent = useMemo(() => {
    const findParent = (targetValue, nodes) => {
      for (const node of nodes) {
        if (node[value] === targetValue) {
          return node[value];
        }
        if (node.children) {
          const childResult = findParent(targetValue, node.children);
          if (childResult) {
            return node.id;
          }
        }
      }
      return null;
    };
    return (value) => findParent(value, options);
  }, [options]);

  const modifyTreeValues = (options, depth = 0) => {
    return options.map((item) => {
      return {
        ...item,
        value: `${item[value]}_${depth}`,
        label: formatLabel(item, uischema?.options?.labelFormat),
        children: item.children ? modifyTreeValues(item.children, depth + 1) : [],
      };
    });
  };

  const formatValue = (nodes, targetValue) => {
    if (!targetValue) return null;

    for (const node of nodes) {
      const originalValue = node[value];

      if (originalValue == targetValue) {
        return formatLabel(node, uischema?.options?.labelFormat);
      }

      if (node.children) {
        const result = formatValue(node.children, targetValue);
        if (result) return result;
      }
    }
    return null;
  };

  return (
    <TreeSelectContainer>
      <RelativeFieldWrapper error={errors} showError={false} label={label}>
        <StyledTreeSelect
          disabled={!enabled}
          value={formatValue(options, data?.[valueKey] || data)}
          error={!!errors}
          treeData={modifyTreeValues(options)}
          style={{ width: '100%' }}
          suffixIcon={<StyledIcons name={IconName.dropdownArrow} />}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          fieldNames={{
            label: 'label',
            children: 'children',
            value: 'value',
          }}
          onChange={(val: any) => {
            const value = val.split('_')[0];
            if (valueKey && parentKey) {
              handleChange(path, {
                [valueKey]: value,
                [parentKey]: findTopLevelParent(value),
              });
            } else {
              handleChange(path, value);
            }
          }}
          placeholder={uischema?.options?.placeholder || 'Pasirinkite'}
        />
      </RelativeFieldWrapper>
    </TreeSelectContainer>
  );
};

const TreeSelectContainer = styled.div`
  height: 100%;
  overflow: hidden;
  height: 68px;
`;

const StyledIcons = styled(Icon)`
  color: #cdd5df;
  font-size: 2.4rem;
`;

const RelativeFieldWrapper = styled(FieldWrapper)`
  position: relative;
  height: 100%;
`;

const StyledTreeSelect = styled(TreeSelect)<{ error: boolean }>`
  .ant-select-arrow{
    top: 50%;
  }

:where(.css-dev-only-do-not-override-tpassh).ant-select-single {
    height: auto;
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
      border: 1px solid ${({ theme, error }) =>
        error ? theme.colors.danger : theme.colors.border} !important;
      border-radius: ${({ theme }) => theme.radius?.fields || 0.4}rem; !important;
      background-color: ${({ theme }) => theme.colors.fields?.background || 'white'};
      color: ${({ theme }) => theme.colors.fields?.text || '#101010'};
    }
  
    .ant-select-selection-overflow-item{
      padding-top:4px;
    }
  
    .ant-select-selector,
    .ant-select-disabled {
      cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
      opacity: ${({ disabled }) => (disabled ? 0.48 : 1)};
      background: white !important;
    }
  
  
    .ant-select-selector:focus-within {
      border-color: ${({ theme }) =>
        theme.colors.fields?.borderFocus || theme.colors.fields?.border || '#d4d5de'} !important;
      box-shadow: ${({ theme }) =>
        theme.colors.fields?.borderFocus
          ? `0 0 0 4px ${theme.colors.fields.borderFocus}33`
          : 'none'} !important;
      outline: none !important;
      animation-duration: 0s !important;
      transition: none !important;
    }
  `;
