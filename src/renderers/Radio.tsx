import { SelectField } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';
import {
  formatError,
  formatLabel,
  handleClearOnChange,
  handleSetOnChange,
} from '../utils/functions';
import { useOptions } from '../utils/hooks';
import styled from 'styled-components';

export const RadioRenderer = ({
  data,
  handleChange,
  path,
  label,
  schema,
  uischema,
  errors,
  enabled,
  visible,
}: ControlProps) => {
  const options = useOptions({ schema, uischema });
  const setOnChange = handleSetOnChange({ uischema, path, handleChange });
  const clearOnChange = handleClearOnChange({ uischema, path, handleChange });
  const valueKey = uischema?.options?.value;
  const value = valueKey ? options.find((item) => item[valueKey] === data) : data;
  const render = uischema?.options?.render;

  if (!visible) return <></>;

  return (
    <>
      <RadioContainer $error={!!errors}>
        {options.map((option, index) => {
          if (render && render != index + 1) return;
          else
            return (
              <Styledlabel key={option}>
                <StyledInput
                  type="radio"
                  name={path}
                  id={option}
                  checked={data === option}
                  disabled={!enabled}
                  value={option}
                  onChange={() => {
                    handleChange(path, option);
                    clearOnChange();
                    setOnChange(option);
                  }}
                />
                {option}
              </Styledlabel>
            );
        })}
      </RadioContainer>
      {!!errors && <Error>Pažymėkite bent vieną atsakymą</Error>}
    </>
  );
};
const Error = styled.p`
  margin: 0;
  line-height: 2.4rem;
  font-size: 1.4rem;
  color: #fe5b78;
`;
const StyledInput = styled.input`
  margin: 0 10px 0 0;
`;

const Styledlabel = styled.label`
  cursor: pointer;
  font-size: 1.4rem;
  margin: 8px 0;
`;

const RadioContainer = styled.div<{ $error: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: ${({ $error }) => ($error ? `2px solid #FE5B78` : '0px')};
  padding: ${({ $error }) => ($error ? `0 4px` : '0px')};
`;
