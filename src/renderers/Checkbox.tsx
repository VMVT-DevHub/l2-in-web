import { CheckBox } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';
import { JsonFormsStateContext, useJsonForms } from '@jsonforms/react';
import { useEffect } from 'react';
import styled from 'styled-components';

export const CheckBoxRenderer = ({
  uischema,
  data,
  handleChange,
  errors,
  path,
  label,
  enabled,
  schema,
  description,
}: ControlProps) => {
  const margin = uischema?.options?.margin;
  const defaultValue = schema?.default;
  const ctx: JsonFormsStateContext = useJsonForms();
  const isJACopy = (schema as any)['x-isJACopy'];
  const sender = ctx?.core?.data?.siuntejas;
  const senderCode = sender?.['ja-duomenys']?.['ja-moketojo-kodas'];
  const senderTitle = sender?.['ja-duomenys']?.['ja-pavadinimas'];
  const senderCodeFA = sender?.['fa-duomenys']?.['fa-moketojo-kodas'];
  const senderTitleFA =
    sender?.['fa-duomenys']?.['vardas'] + ' ' + sender?.['fa-duomenys']?.['pavarde'];
  const userType = ctx?.core?.data?.['pakrovimo-vieta']?.asmuo?.tipas;

  useEffect(() => {
    if (!isJACopy) return;

    if (isJACopy && data == true) {
      if (userType == 'Fizinis asmuo') {
        handleChange('pakrovimo-vieta.asmuo.asmens-kodas', senderCodeFA);
        handleChange('pakrovimo-vieta.asmuo.vardas-pavarde', senderTitleFA);
      } else {
        handleChange('pakrovimo-vieta.asmuo.imones-kodas', senderCode);
        handleChange('pakrovimo-vieta.asmuo.imones-pavadinimas', senderTitle);
      }
    }
  }, [isJACopy, senderCode, senderTitle, data, senderCodeFA, senderTitleFA]);

  return (
    <StyledCheckBox
      value={defaultValue ? defaultValue : data}
      onChange={(value) => handleChange(path, value)}
      label={label}
      error={!!errors}
      disabled={!enabled}
      description={description}
      margin={margin}
      {...uischema?.options}
    />
  );
};

const StyledCheckBox = styled(CheckBox)<{ margin?: string }>`
  margin: ${({ margin }) => (margin ? `8px ${margin}` : '6px 0')};
`;
