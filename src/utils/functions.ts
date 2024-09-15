import { toast } from 'react-toastify';

export const handleError = (responseError = 'Įvyko klaida, prašome pabandyti vėliau') => {
  toast.error(responseError, {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
  });
};

export const isNew = (id?: string) => !id || id === 'naujas';
