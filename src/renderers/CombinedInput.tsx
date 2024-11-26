import { CombinedField } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';

export const CombinedInput = ({
  data,
  handleChange,
  errors,
  path,
  visible,
  label,
  uischema,
  enabled,
  schema,
}: ControlProps) => {
  if (!visible) return <></>;

  const schemaProperties = schema?.properties || {};
  const inputKey = uischema.options?.inputKey;
  const optionKey = uischema.options?.optionKey;
  const props = uischema.options?.props || {};
  const options = schemaProperties?.[optionKey]?.enum || [];

  const value = {
    input: data?.[inputKey]?.toString() || '',
    option: data?.[optionKey] || options[0] || '',
  };

  const isNumeric = schemaProperties[inputKey].type === 'number';

  const handleValue = (val) => {
    const newValue = {
      [inputKey]: val.input ? (isNumeric ? Number(val.input) : val.input) : undefined,
      [optionKey]: val.option || undefined,
    };
    handleChange(path, newValue);
  };

  return (
    <CombinedField
      label={label}
      disabled={!enabled}
      value={value}
      options={options}
      numeric={isNumeric}
      onChange={handleValue}
      error={errors}
      showError={false}
      {...props}
    />
  );
};
