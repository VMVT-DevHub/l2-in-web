import { device } from '@aplinkosministerija/design-system';
import { materialCells } from '@jsonforms/material-renderers';
import { JsonForms } from '@jsonforms/react';
import { useMutation, useQuery } from '@tanstack/react-query';
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

const Form = ({ formType }) => {
  const backRoutes = {
    certificates: slugs.certificates,
    food: slugs.foodRequests,
  };
  const { form = '', requestId = '' } = useParams();
  const [values, setValues] = useState<any>({});
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
    onSuccess: () => navigate(slugs.certificates),
    retry: false,
  });

  const shouldShowLoader =
    isFormLoading ||
    !formData ||
    isRequestLoading ||
    (!isNew(requestId) && !Object.keys(values).length);

  const showDraftButton = !request?.status || request.status === StatusTypes.DRAFT;

  const showDeleteButton =
    !isNew(requestId) && (!request?.status || request.status === StatusTypes.DRAFT);

  if (shouldShowLoader) {
    return <FullscreenLoader />;
  }

  const handleSubmit = (isDraft) => {
    createOrUpdateRequest.mutateAsync(isDraft ? StatusTypes.DRAFT : StatusTypes.CREATED);
  };

  const handleDelete = () => {
    deleteRequest.mutateAsync();
  };

  return (
    <Container>
      <InnerContainer>
        <JsonForms
          schema={formData.schema}
          uischema={formData.uiSchema}
          config={{ submitForm: handleSubmit, showDraftButton, showDeleteButton, handleDelete }}
          data={values}
          renderers={customRenderers}
          cells={materialCells}
          onChange={({ data }) => setValues(data)}
          readonly={!!request && !request?.canEdit}
        />
      </InnerContainer>
      {!showDraftButton && <HistoryContainer open={true} requestId={requestId} />}
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
