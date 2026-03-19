import MultiSelectField from './MultiSelectField';
import { ArrayLayoutProps, resolveData } from '@jsonforms/core';
import { JsonFormsStateContext, useJsonForms } from '@jsonforms/react';
import { useOptions } from '../utils/hooks';
import { formatError, handleClearOnChange, handleSetOnChange } from '../utils/functions';
import { useEffect, useState } from 'react';
import { animalFoodMap } from '../utils/constants';

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
  const isAnimalField = (schema as any)['x-animal'];
  const options = useOptions({ schema, uischema });
  const props = uischema.options?.props;
  const allErrors = ctx.core?.errors || [];
  const [filteredOptions, setFilteredOptions] = useState(options);
  const animal = ctx?.core?.data?.veiklos['pasaru-detalizacija-79']?.gyvunai;

  useEffect(() => {
    if (isAnimalField && animal) {
      setFilteredOptions(animalFoodMap[animal]);
    }
  }, [animal]);

  const fieldErrors = allErrors
    .filter((e) => e.instancePath === `/${path.replace(/\./g, '/')}` && e.keyword == 'oneOf')
    .map((e) => e.parentSchema?.errorMessage?.oneOf)
    .join(', ');

  const combinedErrors = [errors, fieldErrors].filter(Boolean).join(', ');

  const handleMouseOver = (option) => {
    if (!descriptions) return;
    setDescription(option);
  };

  if (!visible) return null;

  return (
    <MultiSelectField
      label={label}
      disabled={!enabled}
      error={combinedErrors ? formatError(combinedErrors) : formatError(errors)}
      options={filteredOptions}
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
