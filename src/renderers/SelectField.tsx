import SelectField from './Select';
import { ControlProps } from '@jsonforms/core';
import {
  formatError,
  formatLabel,
  handleClearOnChange,
  handleSetOnChange,
} from '../utils/functions';
import { useOptions } from '../utils/hooks';
import { useState } from 'react';

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
  const descriptions = (schema as any)['x-info'];
  const value = valueKey ? options.find((item) => item[valueKey] === data) : data;
  const [description, setDescription] = useState('');

  const handleMouseOver = (option) => {
    if (!descriptions) return;

    if (typeof option == 'string') setDescription(descriptions[option]);
    else setDescription(descriptions[option.name]);
  };

  if (!visible) return <></>;

  return (
    <SelectField
      onChange={(value = '') => {
        handleChange(path, valueKey ? value?.[valueKey] : value);
        clearOnChange();
        setOnChange(value);
      }}
      handleMouseOver={(options) => {
        handleMouseOver(options);
      }}
      description={description}
      label={label}
      getOptionLabel={(val) => {
        return formatLabel(val, uischema?.options?.labelFormat);
      }}
      options={options}
      value={value}
      error={formatError(errors)}
      disabled={!enabled}
      showError={true}
    />
  );
};
