import { toast } from 'react-toastify';
import Cookies from 'universal-cookie';
import { ProfileId } from '../types';
import { UISchemaElement } from '@jsonforms/core';

const cookies = new Cookies();

export const handleError = (responseError = 'Įvyko klaida, prašome pabandyti vėliau') => {
  toast.error(responseError, {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
  });
};

export const handleSuccess = (message: string) => {
  if(message)
  toast.success(message, {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
  });
};

export const isNew = (id?: string) => !id || id === 'naujas';

export const handleSelectProfile = (profileId: ProfileId) => {
  if (cookies.get('profileId')?.toString() === profileId?.toString()) return;

  cookies.set('profileId', `${profileId}`, {
    path: '/',
    expires: new Date(new Date().getTime() + 60 * 60 * 24 * 1000 * 30),
  });

  window.location.reload();
};

export const formatLabel = (data: any, format?: string) => {
  if (!format || !data) return data;

  return Object.keys(data).reduce((formattedLabel, key) => {
    const placeholder = new RegExp(`\\$\\{${key}\\}`, 'g');
    return formattedLabel.replace(placeholder, data[key] || '');
  }, format);
};

export const getDefault = (schema, path) => {
  if (!path) return;
  const sections = path.split('.');
  let subSchema = schema;
  for (const element of sections) {
    subSchema = subSchema?.properties?.[element];
  }
  return subSchema?.default;
};

function replacePathByKey(path: string, key: string) {
  const propToReplace = path.split('.').pop() || '';
  return path.replace(propToReplace, key);
}

export const handleSetOnChange = ({
  path,
  uischema,
  handleChange,
}: {
  path: string;
  uischema: UISchemaElement;
  handleChange(path: string, value: any): void;
}) => {
  const onChangeSet = uischema?.options?.onChangeSet || {};
  const keys = Object.keys(onChangeSet || {});

  return (value: any) => {
    if (!keys?.length) return;

    for (const key of keys) {
      const valueToSet = onChangeSet[key] ? value[onChangeSet[key]] : value;

      handleChange(replacePathByKey(path, key), valueToSet);
    }
  };
};

export const handleClearOnChange = ({
  path,
  uischema,
  handleChange,
}: {
  path: string;
  uischema: UISchemaElement;
  handleChange(path: string, value: any): void;
}) => {
  const keys = uischema?.options?.onChangeClear || [];

  return () => {
    if (!keys?.length) return;

    for (const key of keys) {
      handleChange(replacePathByKey(path, key), undefined);
    }
  };
};
