import { SelectField, TextField } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';
import styled from 'styled-components';

export const CombinedInput = ({
  data,
  handleChange,
  errors,
  path,
  visible,
  label,
  uischema,

  schema,
  ...rest
}: ControlProps) => {
  if (!visible) return <></>;

  return (
    <RelativeContainer>
      <StyledTextField
        value={data}
        onChange={(value) => handleChange(path, value)}
        label={label}
        error={errors}
        name={label}
        right={
          <StyledSelectField
            onChange={() => {}}
            options={['test', 'test']}
            getOptionLabel={(item) => item}
          />
        }
        showError={false}
      />
    </RelativeContainer>
  );
};

const StyledSelectField = styled(SelectField)`
  position: absolute;
  div {
    border: none;
  }
  width: 100px;
  right: 0px;
  z-index: 0;
`;

const StyledTextField = styled(TextField)`
  z-index: 1;
`;

const RelativeContainer = styled.div`
  position: relative;
  z-index: 1;
`;
