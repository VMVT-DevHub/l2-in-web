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
