import { toast } from 'react-toastify';
import Cookies from 'universal-cookie';
import { ProfileId } from '../types';

const cookies = new Cookies();

export const handleError = (responseError = 'Įvyko klaida, prašome pabandyti vėliau') => {
  toast.error(responseError, {
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
