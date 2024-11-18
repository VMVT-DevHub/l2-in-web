import { device } from '@aplinkosministerija/design-system';
import { createAjv, ValidationMode } from '@jsonforms/core';
import { materialCells } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Ajv from 'ajv';
import addErrors from 'ajv-errors';
import addFormats from 'ajv-formats';
import { useState } from 'react';
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
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

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
      enabled: !isNew(requestId),
      refetchOnWindowFocus: false,
    },
  );

  const createOrUpdateRequest = useMutation(
    (status: StatusTypes) =>
      isNew(requestId)
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

  const shouldShowLoader = isFormLoading || !formData || isRequestLoading;
  const showDraftButton = !request?.status || request.status === StatusTypes.DRAFT;

  const showDeleteButton =
    !isNew(requestId) && (!request?.status || request.status === StatusTypes.DRAFT);

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
        setOpen(true);

        return;
      }
    }

    await createOrUpdateRequest.mutateAsync(isDraft ? StatusTypes.DRAFT : StatusTypes.CREATED);
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
      <HistoryContainer open={open} requestId={requestId} errors={errors} />
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
