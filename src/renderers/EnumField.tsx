import {
  ButtonsGroup,
  device,
  FieldWrapper,
  SelectField,
} from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';
import { TreeSelect } from 'antd';
import { useLayoutEffect } from 'react';
import styled from 'styled-components';
import Icon, { IconName } from '../components/Icons';

export const EnumRenderer = ({
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
  useLayoutEffect(() => {
    if (!!schema?.default && !data) {
      handleChange(path, schema?.default);
    }
  }, [schema, data]);

  const options = (schema as any)?.options || schema?.enum || [];
  const valueKey = uischema?.options?.value;
  const value = valueKey ? options.find((item) => item[valueKey] === data) : data;

  if (!visible) return <></>;

  if (uischema?.options?.display === 'buttonGroup') {
    return (
      <ButtonsGroup
        onChange={(value) => handleChange(path, value)}
        label={label}
        getOptionLabel={(val) => val}
        options={options}
        isSelected={(item) => item === data}
        disabled={!enabled}
      />
    );
  }

  if (uischema?.options?.display === 'tree') {
    const modifyTreeValues = (options, depth = 0) => {
      return options.map((item) => ({
        ...item,
        value: `${item[valueKey]}_${depth}`,
        children: item.children ? modifyTreeValues(item.children, depth + 1) : [],
      }));
    };

    return (
      <TreeSelectContainer>
        <RelativeFieldWrapper error={errors} showError={false} label={label}>
          <StyledTreeSelect
            disabled={!enabled}
            value={data}
            error={!!errors}
            treeData={modifyTreeValues(options)}
            style={{ width: '100%' }}
            suffixIcon={<StyledIcons name={IconName.dropdownArrow} />}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            fieldNames={{
              label: uischema?.options?.label,
              children: 'children',
              value: 'value',
            }}
            onChange={(val: any) => {
              handleChange(path, val.split('_')[0]);
            }}
            placeholder="Pasirinkite"
          />
        </RelativeFieldWrapper>
      </TreeSelectContainer>
    );
  }

  return (
    <SelectField
      onChange={(value) => handleChange(path, valueKey ? value?.[valueKey] : value)}
      label={label}
      getOptionLabel={(val) => {
        if (!uischema?.options?.label) return val;

        const labels = uischema?.options?.label
          .split(',')
          .map((part) => {
            return val?.[part] || '';
          })
          .join(' - ');

        return labels;
      }}
      options={options}
      value={value}
      error={errors}
      disabled={!enabled}
      showError={false}
    />
  );
};

const TreeSelectContainer = styled.div`
  display: block;
  @media ${device.mobileL} {
    border: none;
  }
`;

const StyledIcons = styled(Icon)`
  color: #cdd5df;
  font-size: 2.4rem;
`;

const RelativeFieldWrapper = styled(FieldWrapper)`
  position: relative;
`;

const StyledTreeSelect = styled(TreeSelect)<{ error: boolean }>`
.ant-select-arrow{
  top: 65%;
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
