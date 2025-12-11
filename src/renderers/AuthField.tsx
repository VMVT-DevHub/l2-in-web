import { TextField } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';
import { useContext, useEffect } from 'react';
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

  if (value && !data && value !== data) {
    handleChange(path, value);
  }

  return (
    <StyledTextField
      value={data}
      onChange={(value) => handleChange(path, value || undefined)}
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
