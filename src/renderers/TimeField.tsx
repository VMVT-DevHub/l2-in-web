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
}: ControlProps) => {
  const getDate = () => {
    if (!data) return undefined;

    const date = new Date(`1970-01-02T${data.slice(0, data.length - 1)}`);

    if (isNaN(date?.getTime())) return undefined;

    return date;
  };
  return (
    <StyledTimePicker
      value={getDate()}
      onChange={(value) => {
        handleChange(path, value ? formatTime(value) : undefined);
      }}
      label={label}
      error={errors}
      showError={false}
      disabled={!enabled}
    />
  );
};

const StyledTimePicker = styled(TimePicker)`
  .react-datepicker--time-only {
    top: 75px;
  }
`;
