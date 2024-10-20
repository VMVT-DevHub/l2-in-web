import { SelectField } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';
import styled from 'styled-components';
import { formatLabel } from '../utils/functions';
import { useOptions } from '../utils/hooks';

export const CountryFieldRenderer = ({
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
  const valueKey = uischema?.options?.value;
  const value = valueKey ? options.find((item) => item[valueKey] === data) : data;

  if (!visible) return <></>;

  return (
    <SelectField
      onChange={(value) => {
        handleChange(path, valueKey ? value?.[valueKey] : value);
      }}
      label={label}
      getOptionLabel={(val) => {
        return formatLabel(val, uischema?.options?.labelFormat);
      }}
      getOptionComponent={(val) => {
        return (
          <OptionRow>
            <div>
              <span className={`fi fi-${val?.iso?.toLowerCase()}`} />
            </div>
            <Iso>{val?.iso}</Iso>
            {formatLabel(val, uischema?.options?.labelFormat)}
          </OptionRow>
        );
      }}
      options={options}
      value={value}
      error={errors}
      disabled={!enabled}
      showError={false}
    />
  );
};

const Iso = styled.div`
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 18.8px;
  text-align: left;
  color: #4a4d5a66;
`;

const OptionRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  white-space: nowrap;
`;
