import { ButtonsGroup } from '@aplinkosministerija/design-system';
import { ControlProps } from '@jsonforms/core';
import { useOptions } from '../utils/hooks';
import { handleClearOnChange } from '../utils/functions';

export const ButtonGroupRenderer = ({
  data,
  handleChange,
  path,
  label,
  schema,
  enabled,
  visible,
  uischema,
}: ControlProps) => {
  if (!visible) return <></>;

  const options = useOptions({ schema, uischema });

  const clearOnChange = handleClearOnChange({ uischema, path, handleChange });

  return (
    <ButtonsGroup
      onChange={(value) => {
        handleChange(path, value);
        clearOnChange();
      }}
      label={label}
      getOptionLabel={(val) => val}
      options={options}
      isSelected={(item) => item === data}
      disabled={!enabled}
    />
  );
};
