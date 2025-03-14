import { DatePicker, TimePicker } from '@aplinkosministerija/design-system';
import { ControlProps, resolveData } from '@jsonforms/core';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDate, formatTime } from '../utils/format';
import styled from 'styled-components';
import { addMinutes } from 'date-fns';

export const DateTimeRenderer = ({
  data,
  handleChange,
  errors,
  path,
  label,
  enabled,
  uischema,
  config,
}: ControlProps) => {
  const minDate = uischema?.options?.minDate;
  const maxDate = uischema?.options?.maxDate;

  const minDateValue = minDate && resolveData(config?.rootData, minDate);
  const maxDateValue = maxDate && resolveData(config?.rootData, maxDate);

  const dateLabel = uischema?.options?.labels?.date;
  const timeLabel = uischema?.options?.labels?.time;

  const dateTime = data ? new Date(data) : undefined;
  const date = formatDate(data ? new Date(data) : new Date());
  const time = formatTime(data ? new Date(data) : new Date());

  const updateDateTime = (dateString: string) => {
    const offset = new Date(dateString).getTimezoneOffset();
    return addMinutes(new Date(dateString), offset).toISOString();
  };

  return (
    <>
      <DatePicker
        value={dateTime}
        onChange={(value) => {
          if (!value) handleChange(path, undefined);
          else {
            const dateString = [formatDate(value), time].join('T');
            handleChange(path, updateDateTime(dateString));
          }
        }}
        label={dateLabel}
        error={errors}
        name={label}
        showError={false}
        disabled={!enabled}
        minDate={minDateValue ? new Date(minDateValue) : undefined}
        maxDate={maxDateValue ? new Date(maxDateValue) : undefined}
      />
      <StyledTimePicker
        value={dateTime}
        onChange={(value) => {
          if (!value) handleChange(path, undefined);
          else {
            const dateString = [date, formatTime(value)].join('T');
            handleChange(path, updateDateTime(dateString));
          }
        }}
        label={timeLabel}
        error={errors}
        showError={false}
        disabled={!enabled}
        minDate={minDateValue ? new Date(minDateValue) : undefined}
        maxDate={maxDateValue ? new Date(maxDateValue) : undefined}
      />
    </>
  );
};

const StyledTimePicker = styled(TimePicker)`
  .react-datepicker--time-only {
    top: 75px;
  }
`;
