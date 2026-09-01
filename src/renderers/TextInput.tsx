import { TextField } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';
import { formatError } from '../utils/functions';
import styled from 'styled-components';
import { JsonFormsStateContext, useJsonForms } from '@jsonforms/react';
import { useEffect, useLayoutEffect } from 'react';
import { actionToEVRK } from '../utils/constants';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';

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
  const isVeiklaTitle = (schema as any)['x-isVeiklaTitle'];
  const displayValue = isEVRK ? actionToEVRK[animal] : data;
  const regNo = ctx?.core?.data?.veiklaviete?.['registracijos-nr']?.trim() || '';
  const isEditForm = (schema as any)['x-edit'];

  const { data: decisionData } = useQuery({
    queryKey: ['decisionAction', regNo, isEditForm],
    queryFn: () => api.getDecisionAction(regNo),
    enabled: !!isEditForm && regNo.length > 3,
  });

  useEffect(() => {
    if (!isEditForm || !decisionData) return;

    if (isVeiklaTitle) {
      handleChange(path, decisionData?.actionPlaceTitle);
    }
  }, [decisionData, isVeiklaTitle, isEditForm]);

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
  margin: ${({ margin }) => (margin ? `0px ${margin}` : '0px 0')};
`;
