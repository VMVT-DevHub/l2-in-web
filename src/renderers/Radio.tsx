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
    <RadioContainer>
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
  );
};

const StyledInput = styled.input`
  margin: 0 10px 0 0;
`;

const Styledlabel = styled.label`
  cursor: pointer;
  font-size: 1.4rem;
  margin: 6px 0;
`;

const RadioContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
