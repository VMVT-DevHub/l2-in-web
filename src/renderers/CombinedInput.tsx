import { CombinedField } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';
import { formatError } from '../utils/functions';

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
  const hasPattern = schemaProperties[inputKey].pattern;

  const handleValue = (val) => {
    //allow user to clear input. Test regex pattern only if user types something
    if (val.input && (data?.[inputKey]?.toString().length || 0) < val.input.length) {
      if (hasPattern && val.input) {
        const regex = new RegExp(hasPattern);
        if (!regex.test(val.input)) {
          return;
        }
      }
    }

    const newValue = {
      [inputKey]: val.input ? (isNumeric ? Number(val.input) : val.input) : undefined,
      [optionKey]: val.option || undefined,
    };
    handleChange(path, val.input ? newValue : undefined);
  };

  return (
    <CombinedField
      label={label}
      disabled={!enabled}
      value={value}
      options={options}
      numeric={isNumeric}
      onChange={handleValue}
      error={formatError(errors)}
      showError={true}
      {...props}
    />
  );
};
