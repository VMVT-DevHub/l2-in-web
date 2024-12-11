import { SelectField } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';
import { formatLabel, handleClearOnChange, handleSetOnChange } from '../utils/functions';
import { useOptions } from '../utils/hooks';

export const SelectFieldRenderer = ({
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

  if (!visible) return <></>;

  return (
    <SelectField
      onChange={(value = '') => {
        handleChange(path, valueKey ? value?.[valueKey] : value);
        clearOnChange();
        setOnChange(value);
      }}
      label={label}
      getOptionLabel={(val) => {
        return formatLabel(val, uischema?.options?.labelFormat);
      }}
      options={options}
      value={value}
      error={errors}
      disabled={!enabled}
      showError={false}
    />
  );
};
