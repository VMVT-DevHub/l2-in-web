import { CreatableMultiSelect } from '@aplinkosministerija/design-system';
import { ArrayLayoutProps, resolveData } from '@jsonforms/core';
import { useJsonForms } from '@jsonforms/react';

export const CreatableMultiSelectRerender = ({
  path,
  visible,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  handleChange,
  label,
  enabled,
}: ArrayLayoutProps) => {
  const ctx = useJsonForms();
  const formData = resolveData(ctx.core?.data, path);

  if (!visible) return <></>;

  return (
    <CreatableMultiSelect
      disabled={!enabled}
      label={label}
      onChange={(values) => handleChange(path, values)}
      values={formData || []}
    />
  );
};

export default CreatableMultiSelectRerender;
