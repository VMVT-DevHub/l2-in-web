import { device, FieldWrapper } from '@aplinkosministerija/design-system';
import { ControlProps, resolveData } from '@jsonforms/core';
import { useJsonForms } from '@jsonforms/react';
import { TreeSelect } from 'antd';
import styled from 'styled-components';
import Icon, { IconName } from '../components/Icons';
import { formatLabel } from '../utils/functions';
import { useOptions } from '../utils/hooks';

export const MultiTreeSelectFieldRenderer = ({
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
  const ctx = useJsonForms();
  const formData = resolveData(ctx.core?.data, path);
  const options = useOptions({ schema, uischema });
  const valueKey = uischema?.options?.value;

  if (!visible) return <></>;

  const modifyTreeValues = (options) => {
    return options.map((item) => {
      return {
        ...item,
        value: item[valueKey],
        label: formatLabel(item, uischema?.options?.labelFormat),
        children: item.children ? modifyTreeValues(item.children) : [],
      };
    });
  };


  return (
    <TreeSelectContainer>
      <RelativeFieldWrapper error={errors} showError={false} label={label}>
        <StyledTreeSelect
          disabled={!enabled}
          value={formData}
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
          treeCheckable
          showCheckedStrategy={'SHOW_PARENT'}
          onChange={(val: any) => {
            handleChange(path, val);
          }}
          placeholder={uischema?.options?.placeholder || 'Pasirinkite'}
        />
      </RelativeFieldWrapper>
    </TreeSelectContainer>
  );
};

const StyledIcons = styled(Icon)`
  color: #cdd5df;
  font-size: 2.4rem;
`;

const TreeSelectContainer = styled.div`
  display: block;
  @media ${device.mobileL} {
    border: none;
  }
`;

const RelativeFieldWrapper = styled(FieldWrapper)`
  position: relative;
`;

const StyledTreeSelect = styled(TreeSelect)<{ error: boolean }>`
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
    border: 1px solid ${({ theme, error }) => (error ? theme.colors.error : theme.colors.border)} !important;
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
  .ant-select-selection-item {
    padding: 4px;
    height: fit-content;
  }

  :where(.css-dev-only-do-not-override-tpassh).ant-select-multiple
    .ant-select-selection-overflow
    .ant-select-selection-item-content {
    white-space: normal !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
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
