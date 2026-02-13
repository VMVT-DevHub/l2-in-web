import MultiSelectField from './MultiSelectField';
import { ArrayLayoutProps, resolveData } from '@jsonforms/core';
import { JsonFormsStateContext, useJsonForms } from '@jsonforms/react';
import { useOptions } from '../utils/hooks';
import { formatError, handleClearOnChange, handleSetOnChange } from '../utils/functions';
import { useState } from 'react';

export const MultiSelect = ({
  schema,
  uischema,
  errors,
  path,
  enabled,
  visible,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  handleChange,
  label,
}: ArrayLayoutProps) => {
  const ctx: JsonFormsStateContext = useJsonForms();
  const formData = resolveData(ctx.core?.data, path) || [];
  const [description, setDescription] = useState();
  const descriptions = (schema as any)['x-info'];
  const options = useOptions({ schema, uischema });
  const props = uischema.options?.props;

  const handleMouseOver = (option) => {
    if (!descriptions) return;
    setDescription(option);
  };

  if (!visible) return null;

  return (
    <MultiSelectField
      label={label}
      disabled={!enabled}
      error={formatError(errors)}
      options={options}
      handleMouseOver={(options) => {
        handleMouseOver(options);
      }}
      description={description}
      values={formData || []}
      onChange={(values) => handleChange(path, values)}
      getOptionLabel={(option) => option}
      getOptionValue={(option) => option}
      {...props}
    />
  );
};
