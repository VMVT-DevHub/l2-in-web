import { FoodForms, FormTypes, HistoryTypes, StatusTypes } from './constants';

export const requestStatusLabels = {
  [StatusTypes.CREATED]: 'Pateiktas',
  [StatusTypes.SUBMITTED]: 'Pateiktas pakartotinai ',
  [StatusTypes.RETURNED]: 'Grąžintas taisymui',
  [StatusTypes.REJECTED]: 'Atmestas',
  [StatusTypes.APPROVED]: 'Patvirtintas',
  [StatusTypes.COMPLETED]: 'Sertifikatas išduotas',
  [StatusTypes.DRAFT]: 'Juodraštis',
};

export const requestFormHistoryDescriptions = {
  [HistoryTypes.CREATED]: 'pateikė prašymą',
  [HistoryTypes.SUBMITTED]: 'pateikė pakartotinai prašymą',
  [HistoryTypes.RETURNED]: 'grąžino taisyti pateiktą prašymą',
  [HistoryTypes.REJECTED]: 'atmetė pateiktą prašymą',
  [HistoryTypes.APPROVED]: 'patvirtino prašymą',
  [HistoryTypes.COMPLETED]: 'išdavė sertifikatą',
};

export const formTypeLabels = {
  [FormTypes.CERTIFICATES]: 'Sertifikatai',
};

export const foodReasonLabels = {
  [FoodForms.CREATE]: 'Registravimas',
  [FoodForms.UPDATE]: 'Tikslinimas',
  [FoodForms.REMOVE]: 'Panaikinimas',
};

export const animalReasonLabels = {
  [FoodForms.CREATE]: 'Registravimas',
  [FoodForms.UPDATE]: 'Tikslinimas',
  [FoodForms.REMOVE]: 'Panaikinimas',
};

export const buttonLabels = {
  confirm: 'Patvirtinti',
  cancel: 'Atšaukti',
};

export const fileUploadErrors = {
  badFileTypes: 'Blogi failų tipai',
  fileSizesExceeded: 'Viršyti failų dydžiai',
};
