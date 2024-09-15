import { ButtonsGroup, SelectField } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';
import { useLayoutEffect } from 'react';

export const EnumRenderer = ({
  data,
  handleChange,
  path,
  label,
  schema,
  uischema,
  errors,
  enabled,
}: ControlProps) => {
  const options = schema?.enum || [];

  useLayoutEffect(() => {
    if (!!schema?.default && !data) {
      handleChange(path, schema?.default);
    }
  }, [schema, data]);

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

  return (
    <SelectField
      onChange={(value) => handleChange(path, value)}
      label={label}
      getOptionLabel={(val) => val}
      options={options}
      value={data}
      error={errors}
      disabled={!enabled}
      showError={false}
    />
  );
};
