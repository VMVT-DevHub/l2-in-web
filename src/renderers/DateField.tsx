import { DatePicker } from '@aplinkosministerija/design-system';
import { ControlProps, resolveData } from '@jsonforms/core';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDate } from '../utils/format';
import { formatError } from '../utils/functions';

export const DateRenderer = ({
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
  return (
    <DatePicker
      value={data ? new Date(data) : undefined}
      onChange={(value) => {
        handleChange(path, value ? formatDate(value) : undefined);
      }}
      label={label}
      error={formatError(errors)}
      name={label}
      showError={true}
      disabled={!enabled}
      minDate={minDateValue ? new Date(minDateValue) : undefined}
      maxDate={maxDateValue ? new Date(maxDateValue) : undefined}
    />
  );
};
