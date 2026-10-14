import MultiSelectField from './MultiSelectField';
import { ArrayLayoutProps, resolveData } from '@jsonforms/core';
import { JsonFormsStateContext, useJsonForms } from '@jsonforms/react';
import { useOptions } from '../utils/hooks';
import { formatError, handleClearOnChange, handleSetOnChange } from '../utils/functions';
import { useEffect, useState } from 'react';
import { activitySubactivityMap, animalFoodMap } from '../utils/constants';
import styled from 'styled-components';
import MultiSelectFieldCardDisplay from './MultiSelectFieldCardDisplay';
import { Resolve, toDataPath } from '@jsonforms/core';
import { JsonFormsDispatch } from '@jsonforms/react';

export const MultiSelectCardDisplay = ({
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
  // const isAnimalField = (schema as any)['x-animal'];
  // const isSubactivityField = (schema as any)['x-subactivity'];
  const options = useOptions({ schema, uischema });
  const props = uischema.options?.props;
  const allErrors = ctx.core?.errors || [];
  const [filteredOptions, setFilteredOptions] = useState(options);
  const animal = ctx?.core?.data?.veiklos['pasaru-detalizacija-79']?.gyvunai;
  const veikla = ctx?.core?.data?.veiklos?.veikla;
  const detailMap = uischema.options?.detail;
  const detailsKey = uischema.options?.detailsKey;
  const rootSchema = ctx.core?.schema || {};
  const parentPath = path.split('.').slice(0, -1).join('.');
  const detailsPath = detailsKey
    ? parentPath
      ? `${parentPath}.${detailsKey}`
      : detailsKey
    : undefined;

  const toSchemaPointer = (dataPath: string) =>
    '#/' +
    dataPath
      .split('.')
      .map((seg) => (/^\d+$/.test(seg) ? 'items' : `properties/${seg}`))
      .join('/');

  const detailsPointer = detailsPath ? toSchemaPointer(detailsPath) : undefined;

  const getCode = (item: string) => item.split(/\s+[–-]\s+/)[0].trim();

  const renderDetail = (item: string) => {
    const code = getCode(item);
    const detailUi = detailMap?.[code];
    if (!detailUi || !detailsPath || !detailsPointer) return null;

    const subSchema = Resolve.schema(
      rootSchema,
      `${detailsPointer}/properties/${code}`,
      rootSchema,
    );
    if (!subSchema) return null;

    return (
      <JsonFormsDispatch
        uischema={detailUi}
        schema={subSchema}
        path={`${detailsPath}.${code}`}
        renderers={ctx.renderers}
        cells={ctx.cells}
        enabled={enabled}
      />
    );
  };

  const handleValuesChange = (newValues: string[]) => {
    if (detailsPath) {
      const current = resolveData(ctx.core?.data, detailsPath) || {};
      const kept = Object.fromEntries(
        Object.entries(current).filter(([code]) => newValues.some((v) => getCode(v) === code)),
      );
      handleChange(detailsPath, kept);
    }
    handleChange(path, newValues);
  };

  const fieldErrors = allErrors
    .filter((e) => e.instancePath === `/${path.replace(/\./g, '/')}` && e.keyword == 'oneOf')
    .map((e) => e.parentSchema?.errorMessage?.oneOf)
    .join(', ');

  const combinedErrors = [errors, fieldErrors].filter(Boolean).join(', ');

  const handleMouseOver = (option) => {
    if (!descriptions) return;

    // if (typeof option == 'string') setDescription(descriptions[option]);
    // else setDescription(descriptions[option.name]);
  };

  if (!visible) return null;

  return (
    <MultiSelectFieldCardDisplay
      label={label}
      disabled={!enabled}
      error={combinedErrors ? formatError(combinedErrors) : formatError(errors)}
      options={filteredOptions}
      renderDetail={renderDetail}
      descriptions={descriptions}
      handleMouseOver={(options) => {
        handleMouseOver(options);
      }}
      description={description}
      values={formData || []}
      // onChange={(values) => handleChange(path, values)}
      onChange={handleValuesChange}
      getOptionLabel={(option) => option}
      getOptionValue={(option) => option}
      {...props}
    />
  );
};
