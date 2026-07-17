import SelectField from './Select';
import { ControlProps } from '@jsonforms/core';
import {
  formatError,
  formatLabel,
  handleClearOnChange,
  handleSetOnChange,
} from '../utils/functions';
import { useOptions } from '../utils/hooks';
import { useContext, useEffect, useState } from 'react';
import { UserContext, UserContextType } from '../components/UserProvider';
import { JsonFormsStateContext, useJsonForms } from '@jsonforms/react';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';

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
  const ctx: JsonFormsStateContext = useJsonForms();
  const setOnChange = handleSetOnChange({ uischema, path, handleChange });
  const clearOnChange = handleClearOnChange({ uischema, path, handleChange });
  const valueKey = uischema?.options?.value;
  const descriptions = (schema as any)['x-info'];
  const needManualIDs = (schema as any)['x-need-ids'];
  const isVeikla = (schema as any)['x-isVeikla'];
  const value = valueKey ? options.find((item) => item[valueKey] === data) : data;
  const [description, setDescription] = useState('');
  const defaultValue = schema?.default;
  const regNo = ctx?.core?.data?.veiklaviete?.['registracijos-nr'] || '';
  const isEditForm = (schema as any)['x-edit'];

  const { data: decisionData } = useQuery({
    queryKey: ['decisionAction', regNo, isEditForm],
    queryFn: () => api.getDecisionAction(regNo),
    enabled: !!isEditForm && regNo.length > 3,
  });

  useEffect(() => {
    if (!isEditForm || !decisionData) return;

    if (isVeikla) {
      console.log(path);
      handleChange(path, decisionData);
    }
  }, [decisionData, isVeikla, isEditForm]);

  const handleMouseOver = (option) => {
    if (!descriptions) return;

    if (typeof option == 'string') setDescription(descriptions[option]);
    else setDescription(descriptions[option.name]);
  };

  if (!visible) return <></>;

  return (
    <SelectField
      onChange={(value = '') => {
        const val = valueKey ? value?.[valueKey] : value;
        handleChange(path, val);
        const enumValues = schema?.enum || [];
        const id = enumValues.indexOf(val) + 1;

        if (needManualIDs) {
          handleChange(`${path}-id`, id);
        }

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
      value={defaultValue ? defaultValue : value}
      error={formatError(errors)}
      disabled={!enabled}
      showError={true}
    />
  );
};
