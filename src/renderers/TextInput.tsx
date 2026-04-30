import { TextField } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';
import { formatError } from '../utils/functions';
import styled from 'styled-components';
import { JsonFormsStateContext, useJsonForms } from '@jsonforms/react';
import { useLayoutEffect } from 'react';
import { actionToEVRK } from '../utils/constants';

export const CustomTextRenderer = ({
  data,
  handleChange,
  errors,
  path,
  visible,
  label,
  enabled,
  schema,
  uischema,
}: ControlProps) => {
  const type = schema?.type?.toString() || '';
  const ctx: JsonFormsStateContext = useJsonForms();
  const margin = uischema?.options?.margin;
  const defaultValue = schema?.default;
  const isEVRK = (schema as any)['x-EVRK'];
  const animal = ctx?.core?.data?.veiklos?.veikla;

  const displayValue = isEVRK ? actionToEVRK[animal] : data;

  useLayoutEffect(() => {
    if (data === undefined && displayValue !== undefined && isEVRK) {
      handleChange(path, displayValue);
    }
  }, [data, displayValue, path, handleChange, isEVRK]);

  if (!visible) return <></>;

  return (
    <StyledTextField
      value={defaultValue ? defaultValue : displayValue}
      onChange={(value) => handleChange(path, value || undefined)}
      label={label}
      error={formatError(errors)}
      type={type}
      name={label}
      margin={margin}
      showError={true}
      disabled={!enabled}
      placeholder={uischema?.options?.placeholder}
    />
  );
};

const StyledTextField = styled(TextField)<{ margin?: string }>`
  margin: ${({ margin }) => (margin ? `0px ${margin}` : '0')};
`;
