import { ButtonMultiSelect } from '@aplinkosministerija/design-system';
import { ArrayLayoutProps, resolveData } from '@jsonforms/core';
import { JsonFormsStateContext, useJsonForms } from '@jsonforms/react';
import { useOptions } from '../utils/hooks';

export const ButtonMultiSelectRerender = ({
  schema,
  uischema,
  path,
  visible,
  //@ts-ignore
  handleChange,
  label,
}: ArrayLayoutProps) => {
  const ctx: JsonFormsStateContext = useJsonForms();
  const formData = resolveData(ctx.core?.data, path);

  const options = useOptions({ schema, uischema });
  const props = uischema.options?.props;
  if (!visible) return <></>;

  return (
    <ButtonMultiSelect
      label={label}
      options={options}
      onChange={(values) => handleChange(path, values)}
      values={formData || []}
      {...props}
    />
  );
};
