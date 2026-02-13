import styled from 'styled-components';
import { filterSelectedOptions, handleRemove } from '../utils/functions';
import { useSelectData } from '../utils/hooks';
import OptionsContainer from './OptionsContainer';
import { FieldWrapper, MultiTextField } from '@aplinkosministerija/design-system';

export interface SelectOption {
  id?: string | number;
  label?: string;
  [key: string]: any;
}

export interface SelectFieldProps {
  label?: string;
  values: any[];
  error?: string;
  options: SelectOption[] | string[];
  onChange: (option: any) => void;
  disabled?: boolean;
  hasBorder?: boolean;
  description?: string;
  handleMouseOver: (option: any) => void;
  getOptionLabel?: (option: any) => string | JSX.Element;
  getOptionValue?: (option: any) => any;
  refreshOptions?: (id?: string) => any;
  dependantId?: string;
}

const MultiSelectField = ({
  label,
  values = [],
  error,
  options,
  handleMouseOver,
  onChange,
  description,
  disabled = false,
  getOptionLabel = (option) => option.label,
  getOptionValue = (option) => option.id,
  refreshOptions,
  dependantId,
}: SelectFieldProps) => {
  const {
    suggestions,
    input,
    handleToggleSelect,
    showSelect,
    handleBlur,
    handleClick,
    handleOnChange,
    loading,
  } = useSelectData({
    options,
    disabled,
    getOptionLabel,
    refreshOptions,
    dependantId,
    value: values,
    onChange: (option) => onChange([...values, option]),
  });

  return (
    <FieldWrapper onClick={handleToggleSelect} label={label} error={error} handleBlur={handleBlur}>
      <MultiTextField
        values={values}
        label={label}
        input={input || ''}
        error={error}
        onRemove={({ index }) => {
          handleRemove(index, onChange, values);
        }}
        disabled={disabled}
        handleInputChange={handleOnChange}
        getOptionLabel={getOptionLabel}
      />
      <OptionsContainer
        options={filterSelectedOptions(suggestions, values, getOptionValue)}
        handleMouseOver={handleMouseOver}
        getOptionLabel={getOptionLabel}
        description={description}
        showSelect={showSelect}
        handleClick={handleClick}
        loading={loading}
      />
    </FieldWrapper>
  );
};

export default MultiSelectField;
