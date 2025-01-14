import { device } from '@aplinkosministerija/design-system';
import { createAjv, ValidationMode } from '@jsonforms/core';
import { materialCells } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Ajv, { KeywordDefinition } from 'ajv';
import addErrors from 'ajv-errors';
import addFormats from 'ajv-formats';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import FullscreenLoader from '../components/FullscreenLoader';
import HistoryContainer from '../components/HistoryContainer';
import { customRenderers } from '../renderers/Index';
import api from '../utils/api';
import { StatusTypes } from '../utils/constants';
import { handleError, isNew } from '../utils/functions';
import { slugs } from '../utils/routes';

const ajv = new Ajv({ allErrors: true, useDefaults: true });
const formAjv = createAjv({ useDefaults: true });
addErrors(ajv);
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

      for (let i in data['tranzitines-salys']) {
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
        // @ts-ignore
        validation.errors = errors;
        return false;
      }

      return true;
    };
  },
};

ajv.addKeyword(keyword);
formAjv.addKeyword(keyword);

const Form = ({ formType }) => {
  const backRoutes = {
    certificate: slugs.certificates,
    food: slugs.foodRequests,
    animal: slugs.animalRequests,
  };

  const { form = '', requestId = '' } = useParams();
  const [values, setValues] = useState<any>({});
  const [errors, setErrors] = useState<string[]>([]);
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

  useEffect(() => {
    if (isNewRequest) {
      createInitialDraft.mutateAsync();
    }
  }, [isNewRequest]);

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

  const createOrUpdateRequest = useMutation(
    (status: StatusTypes) =>
      isNewRequest
        ? api.createRequest({ data: { ...values }, form, status, formType })
        : api.updateRequest(requestId, { data: { ...values }, form, status, formType }),
    {
      onError: handleAlert,
      onSuccess: () => navigate(backRoutes[formType]),
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

  if (shouldShowLoader) {
    return <FullscreenLoader />;
  }

  const handleSubmit = async ({ isDraft }) => {
    if (!isDraft) {
      const validate = ajv.compile(formData.schema);
      validate(values);

      const errors = validate?.errors;

      if (errors?.length) {
        // Filter out default errors, keeping only custom error messages, as the ajv-errors library sometimes duplicates messages
        const customErrorMessages = errors
          .filter((err: any) => err?.keyword === 'errorMessage')
          .map((err: any) => err?.message);

        setErrors(customErrorMessages);
        setValidationMode('ValidateAndShow');
        setIsOpen(true);

        return;
      }
    }

    const statusToSet =
      request?.status === StatusTypes.RETURNED
        ? StatusTypes.SUBMITTED
        : isDraft
        ? StatusTypes.DRAFT
        : StatusTypes.CREATED;

    await createOrUpdateRequest.mutateAsync(statusToSet);
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
            showDraftButton,
            showDeleteButton,
            deleteForm: handleDelete,
            backRoute: backRoutes[formType],
          }}
          data={values}
          renderers={customRenderers}
          cells={materialCells}
          onChange={({ data }) => {
            setValues(data);
          }}
          validationMode={validationMode}
          ajv={formAjv}
          readonly={!!request && !request?.canEdit}
        />
      </InnerContainer>
      <HistoryContainer
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        requestId={requestId}
        errors={errors}
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
