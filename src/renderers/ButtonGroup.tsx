import { ButtonsGroup } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';
import { useLayoutEffect } from 'react';

export const ButtonGroupRenderer = ({
  data,
  handleChange,
  path,
  label,
  schema,
  enabled,
  visible,
}: ControlProps) => {
  useLayoutEffect(() => {
    if (!!schema?.default && !data) {
      handleChange(path, schema?.default);
    }
  }, [schema, data]);

  if (!visible) return <></>;

  const options = (schema as any)?.options || schema?.enum || [];

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
};
