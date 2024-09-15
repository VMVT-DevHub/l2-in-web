import { DatePicker } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDate } from '../utils/format';

export const DateRenderer = ({
  data,
  handleChange,
  errors,
  path,
  label,
  enabled,
}: ControlProps) => {
  return (
    <DatePicker
      value={data ? new Date(data) : undefined}
      onChange={(value) => {
        handleChange(path, value ? formatDate(value) : undefined);
      }}
      label={label}
      error={errors}
      name={label}
      showError={false}
      disabled={!enabled}
    />
  );
};
