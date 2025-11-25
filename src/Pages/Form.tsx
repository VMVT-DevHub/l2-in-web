/* eslint-disable @typescript-eslint/ban-ts-comment */
import { device } from '@aplinkosministerija/design-system';
import { createAjv, ValidationMode } from '@jsonforms/core';
import { materialCells } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Ajv, { ErrorObject, KeywordDefinition } from 'ajv';
import addErrors from 'ajv-errors';
import addFormats from 'ajv-formats';
import { cloneDeep, unset } from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import ConfirmPopup from '../components/ConfirmPopup';
import FullscreenLoader from '../components/FullscreenLoader';
import HistoryContainer from '../components/HistoryContainer';
import { customRenderers } from '../renderers/Index';
import { ButtonVariants } from '../styles';
import api from '../utils/api';
import { StatusTypes } from '../utils/constants';
import { handleError, handleSuccess, isNew } from '../utils/functions';
import { localizeErrors } from '../utils/localization';
import { slugs } from '../utils/routes';

const getPathTitle = (uiSchema: any, path: string) => {
  if (!uiSchema || !path) return '';
  const rootPath = path.split('/').filter(Boolean)[0];
  return uiSchema.options?.labels?.[rootPath] || '';
};

const ajv = new Ajv({ allErrors: true, useDefaults: true });
const formAjv = createAjv({ useDefaults: true });
addErrors(ajv, { keepErrors: true });
addFormats(ajv);

let EU_COUNTRIES: string[] = [];
api.getEsCountries().then((res) => {
  EU_COUNTRIES = res;
});

const isEU = (country: string) => EU_COUNTRIES.includes(country);

const keyword: KeywordDefinition = {
  keyword: 'validateEuTransit',
  type: 'object',
  errors: true, // Enable custom errors
  compile: function (_schema: any) {
    return function validation(data: any) {
      const errors: any[] = [];

      const flatData: any[] = [];

      flatData.push({
        message: 'Maršrutas: Eksportuojančios šalies',
        instancePath: '/marsrutas/eksportuojanti-salis',
        data: data['eksportuojanti-salis'] || {},
      });

      for (const i in data['tranzitines-salys']) {
        flatData.push({
          message: `Maršrutas: Tranzitinės šalies #${+i + 1}`,
          instancePath: `/marsrutas/tranzitines-salys/${i}`,
          data: data['tranzitines-salys'][i] || {},
        });
      }

      flatData.push({
        message: 'Maršrutas: Importuojančios šalies',
        instancePath: '/marsrutas/importuojanti-salis',
        data: data['importuojanti-salis'] || {},
      });

      for (const [index, item] of flatData.entries()) {
        const prevItem = flatData?.[index - 1];

        if (prevItem?.data?.salis && item.data.salis) {
          if (
            (isEU(prevItem.data.salis) && !isEU(item.data.salis)) ||
            (isEU(item.data.salis) && !isEU(prevItem.data.salis))
          ) {
            if (!prevItem.data['pkp-out']) {
              errors.push({
                keyword: 'errorMessage',
                message: `${prevItem.message} "Išvažiavimo PKP" yra privalomas tranzitui tarp EU ir ne EU šalių`,
                instancePath: `${prevItem.instancePath}/pkp-out`,
              });
            }
            if (!item.data['pkp']) {
              errors.push({
                keyword: 'errorMessage',
                message: `${item.message} "Įvažiavimo PKP" yra privalomas tranzitui tarp EU ir ne EU šalių`,
                instancePath: `${item.instancePath}/pkp`,
              });
            }
          }
        }
      }

      if (errors.length) {
        // @ts-expect-error
        validation.errors = errors;
        return false;
      }

      return true;
    };
  },
};

ajv.addKeyword(keyword);
formAjv.addKeyword(keyword);

const Form = ({ formType, copyEnabled }) => {
  const backRoutes = {
    certificate: slugs.certificates,
    food: slugs.foodRequests,
    animal: slugs.animalRequests,
  };

  const { form = '', requestId = '' } = useParams();
  const [values, setValues] = useState<any>({});
  const [popUpVisible, setPopUpVisible] = useState(false);

  const [errors, setErrors] = useState<ErrorObject<string, Record<string, any>, unknown>[]>([]);
  const [customErrors, setCustomErrors] = useState<string[]>([]);
  const [validationMode, setValidationMode] = useState<ValidationMode>('ValidateAndHide');
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const isNewRequest = isNew(requestId);

  const { data: formData, isFetching: isFormLoading } = useQuery(
    ['form', formType, form],
    () => api.getFormSchema({ formType, form }),
    { retry: false, refetchOnWindowFocus: false },
  );

  const { data: request, isFetching: isRequestLoading } = useQuery(
    ['request', formType, requestId],
    () => api.getRequest({ id: requestId }),
    {
      onError: handleError,
      onSuccess: (request) => setValues(request.data),
      enabled: !isNewRequest,
      refetchOnWindowFocus: false,
    },
  );

  const createInitialDraft = useMutation(
    () => api.createRequest({ data: {}, form, status: StatusTypes.DRAFT, formType }),
    {
      onError: handleAlert,
      onSuccess: (request) => {
        const requestId = request?.id?.toString();
        const form = request?.form;
        const redirectRoute = {
          certificate: slugs.certificateRequest(form, requestId),
          food: slugs.foodRequest(form, requestId),
          animal: slugs.animalRequest(form, requestId),
        };

        navigate(redirectRoute[formType]);
      },

      retry: false,
    },
  );

  useEffect(() => {
    if (isNewRequest) {
      createInitialDraft.mutateAsync();
    }
  }, [isNewRequest]);

  const createOrUpdateRequest = useMutation(
    (status: StatusTypes) =>
      isNewRequest
        ? api.createRequest({ data: { ...values }, form, status, formType })
        : api.updateRequest(requestId, { data: { ...values }, form, status, formType }),
    {
      onError: handleAlert,
      onSuccess: () => {
        if (!errors?.length) {
          navigate(backRoutes[formType]);
        }
      },
      retry: false,
    },
  );

  const copyFormData = (formData: Record<string, unknown>, uischema: any) => {
    const copiedData = cloneDeep(formData);

    function clearFields(data, uischema: any, path = '') {
      if (!uischema || !data) return;

      const elements = uischema?.elements || uischema?.options?.detail?.elements;

      if (elements) {
        for (const element of elements) {
          if (element?.type === 'Control' && element?.scope && element?.options?.clearOnCopy) {
            const deletePath = path + getPathFromScope(element.scope);

            deleteByPath(data, deletePath);
          } else if (typeof element === 'object') {
            const previousPath = path;

            if (element?.scope) {
              path += `${getPathFromScope(element.scope)}.`;
            }

            clearFields(data, element, path);

            path = previousPath;
          }
        }
      }
    }

    const getPathFromScope = (scope: string) =>
      scope.replace(/^#\/|\/?properties\/?|\/+/g, '.').replace(/^\.+|\.+$/g, '');

    const deleteByPath = (obj: Record<string, unknown>, path: string) => {
      const pathParts = path.split('.');

      const deleteRecursively = (
        currentObj: any,
        currentPath: string,
        pathPartsIndex: number = 0,
      ) => {
        if (!currentObj) return;

        const key = pathParts[pathPartsIndex];

        const newPath = pathPartsIndex === 0 ? key : `${currentPath}.${key}`;

        // eslint-disable-next-line no-prototype-builtins
        if (pathPartsIndex === pathParts.length - 1 && currentObj.hasOwnProperty(key)) {
          return unset(obj, newPath);
        }

        if (Array.isArray(currentObj[key])) {
          for (let index = 0; index < currentObj[key].length; index++) {
            const item = currentObj[key][index];
            deleteRecursively(item, `${newPath}.${index}`, pathPartsIndex + 1);
          }
        } else if (typeof currentObj[key] === 'object') {
          deleteRecursively(currentObj[key], newPath, pathPartsIndex + 1);
        }
      };

      deleteRecursively(obj, '');
    };

    clearFields(copiedData, uischema);

    return copiedData;
  };

  const copyRequest = useMutation(
    () =>
      api.createRequest({
        data: copyFormData(values, formData?.uiSchema),
        form,
        status: StatusTypes.DRAFT,
        formType,
      }),
    {
      onError: handleAlert,
      onSuccess: () => {
        navigate(backRoutes[formType]);
        handleSuccess(`Prašymas sėkmingai nukopijuotas.`);
      },
      retry: false,
    },
  );

  const deleteRequest = useMutation(() => api.deleteRequest(requestId), {
    onError: handleAlert,
    onSuccess: () => navigate(backRoutes[formType]),
    retry: false,
  });

  const shouldShowLoader =
    isFormLoading || !formData || isRequestLoading || createInitialDraft.isLoading;
  const showDraftButton = !request?.status || request.status === StatusTypes.DRAFT;

  const showDeleteButton =
    !isNewRequest && (!request?.status || request.status === StatusTypes.DRAFT);

  const showCopyButton =
    !isNewRequest &&
    (!request?.status ||
      [StatusTypes.APPROVED, StatusTypes.COMPLETED].some((status) => status === request.status)) &&
    copyEnabled;

  if (shouldShowLoader) {
    return <FullscreenLoader />;
  }

  const handleSubmit = async ({ isDraft }) => {
    if (isDraft) {
      await createOrUpdateRequest.mutateAsync(StatusTypes.DRAFT);
      return;
    }

    const validate = ajv.compile(formData.schema);
    validate(values);
    const errors = validate?.errors;
    if (errors?.length) {
      localizeErrors(errors);

      // Filter out default errors, keeping only custom error messages, as the ajv-errors library sometimes duplicates messages
      const customErrorMessages = errors
        .filter((err: any) => err?.keyword === 'errorMessage')
        .map((err: any) => {
          const pathTitle = getPathTitle(formData.uiSchema, err.instancePath);
          if (!pathTitle) return err?.message || '';
          return `${pathTitle}: ${err?.message || ''}`;
        });

      setErrors(errors);
      setCustomErrors(customErrorMessages);
      setValidationMode('ValidateAndShow');
      setIsOpen(true);
      // Save the request with validation errors as a DRAFT
      await createOrUpdateRequest.mutateAsync(StatusTypes.DRAFT);
    } else {
      setPopUpVisible(true);
    }
  };

  const handleConfimForm = async () => {
    await createOrUpdateRequest.mutateAsync(
      request?.status === StatusTypes.RETURNED
        ? StatusTypes.SUBMITTED
        : request?.status === StatusTypes.CREATED
        ? StatusTypes.SUBMITTED
        : request?.status === StatusTypes.SUBMITTED
        ? StatusTypes.SUBMITTED
        : StatusTypes.CREATED,
    );
    setPopUpVisible(false);
  };

  const handleDelete = async () => {
    await deleteRequest.mutateAsync();
  };

  return (
    <Container>
      <InnerContainer>
        <JsonForms
          schema={formData.schema}
          uischema={formData.uiSchema}
          config={{
            submitForm: handleSubmit,
            copyForm: copyRequest,
            showDraftButton,
            showDeleteButton,
            showCopyButton,
            deleteForm: handleDelete,
            backRoute: backRoutes[formType],
            rootData: values,
          }}
          data={values}
          renderers={customRenderers}
          cells={materialCells}
          onChange={({ data }) => {
            setValues(data);
            setErrors([]);
          }}
          validationMode={validationMode}
          ajv={formAjv}
          readonly={!!request && !request?.canEdit}
          additionalErrors={errors}
        />
      </InnerContainer>
      <HistoryContainer
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        requestId={requestId}
        errors={customErrors}
      />
      <ConfirmPopup
        visible={popUpVisible}
        onClose={() => setPopUpVisible(false)}
        content={{
          title: 'Ar tikrai norite pateikti prašymą?',
          subtitle: `${formData.schema?.title} bus pateiktas VMVT`,
          confirmButtonTitle: 'Pateikti',
          confirmButtonVariant: ButtonVariants.PRIMARY,
          onConfirm: handleConfimForm,
          onCancel: () => setPopUpVisible(false),
          showCancel: true,
        }}
      />
    </Container>
  );
};

export default Form;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  margin: 0 auto;
  width: 100%;
  overflow-y: auto;
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;

  @media ${device.mobileL} {
    flex-wrap: wrap;
    justify-content: flex-end;
  }
`;

function handleAlert() {
  console.error('An error occurred while processing the request.');
}
