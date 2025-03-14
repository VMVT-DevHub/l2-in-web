import { ErrorObject } from 'ajv';

export const translations = {
  lt: {
    required: 'Privalomas laukas',
  },
};

const translateError = (error: ErrorObject, language = 'lt') => {
  const messageTemplate = translations[language][error.keyword];
  return messageTemplate || error.message; // Fallback to the default message if no translation is found
};

export const localizeErrors = (errors: ErrorObject[], language = 'lt') => {
  return errors.forEach((error) => {
    error.message = translateError(error, language);
  });
};
