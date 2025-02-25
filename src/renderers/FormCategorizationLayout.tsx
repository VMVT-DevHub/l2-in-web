import { Button } from '@aplinkosministerija/design-system';
import { Categorization, Category, isVisible } from '@jsonforms/core';
import { MaterialLayoutRenderer } from '@jsonforms/material-renderers';
import { JsonFormsStateContext, useJsonForms } from '@jsonforms/react';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import styled from 'styled-components';
import BackButton from '../components/BackButton';
import ConfirmPopup from '../components/ConfirmPopup';
import { ButtonVariants } from '../styles';

export const FormCategorizationLayout = ({
  uischema,
  path,
  schema,
  renderers,
  enabled,
  ...rest
}: any) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const {
    core,
    config: { submitForm, copyForm, showDraftButton, showDeleteButton, showCopyButton, deleteForm, backRoute },
  }: JsonFormsStateContext = useJsonForms();

  const handleSubmitDraft = useMutation(() => submitForm({ isDraft: true }), {
    retry: false,
  });

  const handleSubmit = useMutation(() => submitForm({ isDraft: false }), {
    retry: false,
  });

  const handleDelete = useMutation(() => deleteForm(), {
    retry: false,
  });

  const [popUpVisible, setPopUpVisible] = useState(false);

  const categories = uischema.elements.filter((category: Category | Categorization) => {
    if (!core?.ajv) return false;
    return isVisible(category, core?.data, '', core?.ajv);
  });

  const layoutProps = {
    elements: categories[selectedTabIndex].elements,
    path,
    schema,
    uischema,
    direction: 'column',
    renderers,
    ...rest,
  };

  const hasPrevious = selectedTabIndex > 0;
  const hasNext = selectedTabIndex < categories.length - 1;

  const renderTabButtons = () =>
    categories.map((tab, index) => (
      <TabButton
        key={`${index}-tab`}
        isActive={index === selectedTabIndex}
        onClick={() => setSelectedTabIndex(index)}
      >
        <TabLabel isActive={index === selectedTabIndex}>{tab.label}</TabLabel>
      </TabButton>
    ));

  const disabledLoading =
    handleSubmit.isLoading || handleSubmitDraft.isLoading || handleDelete.isLoading || copyForm.isLoading;

  const renderNavigationButtons = () => (
    <ButtonRow>
      {hasPrevious && (
        <Button onClick={() => setSelectedTabIndex(selectedTabIndex - 1)}>
          {`Atgal: ${categories[selectedTabIndex - 1]?.label}`}
        </Button>
      )}
      {hasNext ? (
        <Button onClick={() => setSelectedTabIndex(selectedTabIndex + 1)}>
          {`Kitas: ${categories[selectedTabIndex + 1]?.label}`}
        </Button>
      ) : (
        enabled && (
          <Button
            loading={handleSubmit.isLoading}
            disabled={disabledLoading}
            onClick={() => handleSubmit.mutateAsync()}
          >
            Pateikti
          </Button>
        )
      )}
    </ButtonRow>
  );

  const renderFormLayout = () => (
    <Container>
      <TitleColumn>
        <BackButton backRoute={backRoute} />
        <Row>
          <InnerRow>
            <Title>{schema?.title}</Title>
          </InnerRow>
          <InnerRow>
            {showDeleteButton && (
              <InnerRow>
                <Button
                  disabled={disabledLoading}
                  loading={handleDelete.isLoading}
                  variant={ButtonVariants.DANGER}
                  onClick={() => setPopUpVisible(true)}
                >
                  Ištrinti
                </Button>
                <ConfirmPopup
                  visible={popUpVisible}
                  onClose={() => setPopUpVisible(false)}
                  content={{
                    title: 'Ar tikrai ištrinti?',
                    confirmButtonTitle: 'Ištrinti',
                    confirmButtonVariant: ButtonVariants.DANGER,
                    onConfirm: () => handleDelete.mutateAsync(),
                    onCancel: () => setPopUpVisible(false),
                    showCancel: true,
                  }}
                />
              </InnerRow>
            )}
            {showDraftButton && (
              <InnerRow>
                <Button
                  loading={handleSubmitDraft.isLoading}
                  disabled={disabledLoading}
                  onClick={() => handleSubmitDraft.mutateAsync()}
                >
                  Išsaugoti kaip juodraštį
                </Button>
              </InnerRow>
            )}
            {showCopyButton && (
                <InnerRow>
                  <Button
                      loading={copyForm.isLoading}
                      disabled={disabledLoading}
                      onClick={() => copyForm.mutateAsync()}
                  >
                    Kopijuoti prašymą
                  </Button>
                </InnerRow>
            )}
            {enabled && (
              <InnerRow>
                <Button
                  loading={handleSubmit.isLoading}
                  disabled={disabledLoading}
                  onClick={() => handleSubmit.mutateAsync()}
                >
                  Pateikti
                </Button>
              </InnerRow>
            )}
          </InnerRow>
        </Row>
        <InnerContainer>{renderTabButtons()}</InnerContainer>
      </TitleColumn>
      <MaterialLayoutRenderer {...layoutProps} />
      {renderNavigationButtons()}
    </Container>
  );

  return renderFormLayout();
};

const TitleColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: -16px -16px 50px -16px;
  padding: 16px 16px 0 16px;
  background-color: white;
`;

const Container = styled.div`
  margin-bottom: 16px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;

const InnerRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;

const Title = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #121926;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin: 16px 0;
`;

const InnerContainer = styled.div`
  display: flex;
  flex: 1;
  white-space: nowrap;
  overflow-x: auto;
`;

const TabButton = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: ${({ isActive, theme }) =>
    `4px ${isActive ? theme.colors.primary : 'transparent'} solid`};
  margin-right: 24px;
  cursor: pointer;
`;

const TabLabel = styled.span<{ isActive: boolean }>`
  margin: 8px 0;
  color: ${({ isActive, theme }) => (isActive ? theme.colors.primary : '#121926')};
  font-size: 1.4rem;
`;
