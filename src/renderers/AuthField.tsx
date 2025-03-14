import { TextField } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';
import { useContext, useEffect } from 'react';
import { UserContext, UserContextType } from '../components/UserProvider';
import { formatError } from '../utils/functions';

export const CustomAthFieldRenderer = ({
  data,
  handleChange,
  errors,
  path,
  label,
  enabled,
  uischema,
}: ControlProps) => {
  const { user } = useContext<UserContextType>(UserContext);
  const key = uischema.options?.key;
  const value = user?.[key];

  if (value && !data && value !== data) {
    handleChange(path, value);
  }

  return (
    <TextField
      value={data}
      onChange={(value) => handleChange(path, value || undefined)}
      label={label}
      error={formatError(errors)}
      name={label}
      showError={true}
      placeholder={uischema?.options?.placeholder}
      disabled={!enabled}
    />
  );
};
