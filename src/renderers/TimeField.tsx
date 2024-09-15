import { TimePicker } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';
import styled from 'styled-components';
import { formatTime } from '../utils/format';

export const TimeRenderer = ({
  data,
  handleChange,
  errors,
  path,
  label,
  enabled,
}: ControlProps) => (
  <StyledTimePicker
    value={data ? new Date(`1970-01-01T${data}`) : undefined}
    onChange={(value) => {
      handleChange(path, value ? formatTime(value) : undefined);
    }}
    label={label}
    error={errors}
    showError={false}
    disabled={!enabled}
  />
);

const StyledTimePicker = styled(TimePicker)`
  .react-datepicker--time-only {
    top: 75px;
  }
`;
