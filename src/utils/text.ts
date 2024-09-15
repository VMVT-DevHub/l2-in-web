import { FormTypes, HistoryTypes, StatusTypes } from './constants';

export const requestStatusLabels = {
  [StatusTypes.CREATED]: 'Pateiktas',
  [StatusTypes.SUBMITTED]: 'Pateiktas pakartotinai ',
  [StatusTypes.RETURNED]: 'Grąžintas taisymui',
  [StatusTypes.REJECTED]: 'Atmestas',
  [StatusTypes.APPROVED]: 'Patvirtintas',
  [StatusTypes.DRAFT]: 'Juodraštis',
};

export const requestFormHistoryDescriptions = {
  [HistoryTypes.CREATED]: 'pateikė prašymą',
  [HistoryTypes.SUBMITTED]: 'pateikė pakartotinai prašymą',
  [HistoryTypes.RETURNED]: 'grąžino taisyti pateiktą prašymą',
  [HistoryTypes.REJECTED]: 'atmetė pateiktą prašymą',
  [HistoryTypes.APPROVED]: 'patvirtino prašymą',
};

export const formTypeLabels = {
  [FormTypes.CERTIFICATES]: 'Sertifikatai',
};
