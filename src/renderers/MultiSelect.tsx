import MultiSelectField from './MultiSelectField';
import { ArrayLayoutProps, resolveData } from '@jsonforms/core';
import { JsonFormsStateContext, useJsonForms } from '@jsonforms/react';
import { useOptions } from '../utils/hooks';
import { formatError } from '../utils/functions';
import { useMemo, useState } from 'react';
import { activitySubactivityMap, animalFoodMap } from '../utils/constants';

export const MultiSelect = ({
  schema,
  uischema,
  errors,
  path,
  enabled,
  visible,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  handleChange,
  label,
}: ArrayLayoutProps) => {
  const ctx: JsonFormsStateContext = useJsonForms();
  const formData = resolveData(ctx.core?.data, path) || [];
  const [description, setDescription] = useState<string>();

  const descriptions = (schema as any)['x-info'];
  const isAnimalField = (schema as any)['x-animal'] || false;
  const isSubactivityField = (schema as any)['x-subactivity'] || false;
  const isCategoryField = (schema as any)['x-category'] || false;
  const options = useOptions({ schema, uischema });
  const props = uischema.options?.props;
  const allErrors = ctx.core?.errors || [];
  const veiklos = ctx.core?.data?.veiklos;
  const animal = veiklos?.['pasaru-detalizacija-79']?.gyvunai;
  const veikla = veiklos?.veikla;
  const subveikla = veiklos?.detalizacija;

  const arrayIndex = Number(path.split('.')[2]);
  const currentSubactivity = subveikla?.[arrayIndex];

  const filteredOptions = useMemo(() => {
    if (isCategoryField) {
      const allowedCategories = String(currentSubactivity?.allowedCategories ?? '')
        .split(',')
        .map((category) => category.trim())
        .filter(Boolean);

      return options.filter((option) => allowedCategories.includes(String(option)));
    }

    if (isSubactivityField && veikla) {
      return activitySubactivityMap[veikla] ?? [];
    }

    if (isAnimalField && animal) {
      handleChange(path, []);
      return animalFoodMap[animal] ?? [];
    }

    return options;
  }, [
    options,
    isCategoryField,
    isSubactivityField,
    isAnimalField,
    currentSubactivity?.allowedCategories,
    veikla,
    animal,
  ]);

  const fieldErrors = allErrors
    .filter(
      (error) => error.instancePath === `/${path.replace(/\./g, '/')}` && error.keyword === 'oneOf',
    )
    .map((error) => error.parentSchema?.errorMessage?.oneOf)
    .join(', ');

  const combinedErrors = [errors, fieldErrors].filter(Boolean).join(', ');

  const handleMouseOver = (option: any) => {
    if (!descriptions) return;

    const key = typeof option === 'string' ? option : option?.name;

    setDescription(descriptions[key] ?? '');
  };

  if (!visible) return null;

  return (
    <MultiSelectField
      label={label}
      disabled={!enabled}
      error={combinedErrors ? formatError(combinedErrors) : formatError(errors)}
      options={filteredOptions}
      handleMouseOver={handleMouseOver}
      description={description}
      values={formData}
      onChange={(values) => handleChange(path, values)}
      getOptionLabel={(option) => option}
      getOptionValue={(option) => option}
      {...props}
    />
  );
};
