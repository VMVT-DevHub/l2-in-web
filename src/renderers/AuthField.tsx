import { TextField } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';
import { useContext, useEffect, useLayoutEffect } from 'react';
import { UserContext, UserContextType } from '../components/UserProvider';
import { formatError } from '../utils/functions';
import styled from 'styled-components';

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
  const isHidden = uischema.options?.hidden;
  const value = user?.[key];

  const displayValue = typeof data === 'number' ? String(data) : data;

  useLayoutEffect(() => {
    if (data === undefined && value !== undefined) {
      handleChange(path, value);
    }
  }, [data, value, path, handleChange]);

  return (
    <StyledTextField
      value={displayValue}
      onChange={(value) => handleChange(path, value || '')}
      label={label}
      error={formatError(errors)}
      name={label}
      showError={true}
      placeholder={uischema?.options?.placeholder}
      disabled={!enabled}
      $isHidden={isHidden}
    />
  );
};

const StyledTextField = styled(TextField)<{ $isHidden: boolean }>`
  display: ${({ $isHidden }) => ($isHidden ? 'none' : 'block')};
`;
