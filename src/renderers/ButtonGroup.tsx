import { ButtonsGroup } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';
import { handleClearOnChange } from '../utils/functions';
import { useOptions } from '../utils/hooks';

export const ButtonGroupRenderer = ({
  data,
  handleChange,
  path,
  errors,
  label,
  schema,
  enabled,
  visible,
  uischema,
}: ControlProps) => {
  const options = useOptions({ schema, uischema });

  if (!visible) return <></>;

  const clearOnChange = handleClearOnChange({ uischema, path, handleChange });

  return (
    <ButtonsGroup
      onChange={(value) => {
        handleChange(path, value);
        clearOnChange();
      }}
      error={errors}
      showError={true}
      label={label}
      getOptionLabel={(val) => val}
      options={options}
      isSelected={(item) => item === data}
      disabled={!enabled}
    />
  );
};
