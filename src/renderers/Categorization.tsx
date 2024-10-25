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

export const CategorizationLayout = ({
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
    config: { submitForm, showDraftButton, showDeleteButton, deleteForm },
  }: JsonFormsStateContext = useJsonForms();

  const handleSubmitDraft = useMutation(() => submitForm({ isDraft: true }), {
    retry: false,
  });

  const handleSubmit = useMutation(() => submitForm(), {
    retry: false,
  });

  const handleDelete = useMutation(() => deleteForm(), {
    retry: false,
  });

  const { display } = uischema.options || {};
  const errors = core?.errors;
  const isForm = display === 'form';
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

  const disabled = !enabled || !!errors?.length;

  const disabledLoading =
    handleSubmit.isLoading || handleSubmitDraft.isLoading || handleDelete.isLoading;

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
        <Button
          loading={handleSubmit.isLoading}
          disabled={disabled}
          onClick={() => handleSubmit.mutateAsync()}
        >
          Pateikti
        </Button>
      )}
    </ButtonRow>
  );

  const renderFormLayout = () => (
    <>
      <TitleColumn>
        <BackButton />
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
            <InnerRow>
              <Button
                loading={handleSubmit.isLoading}
                disabled={disabled || disabledLoading}
                onClick={() => handleSubmit.mutateAsync()}
              >
                Pateikti
              </Button>
            </InnerRow>
          </InnerRow>
        </Row>
        <Container>{renderTabButtons()}</Container>
      </TitleColumn>
      <MaterialLayoutRenderer {...layoutProps} />
      {renderNavigationButtons()}
    </>
  );

  const renderDefaultLayout = () => (
    <CategorizationContainer>
      <Container>{renderTabButtons()}</Container>
      <Gap />
      <MaterialLayoutRenderer {...layoutProps} />
      {renderNavigationButtons()}
    </CategorizationContainer>
  );

  return isForm ? renderFormLayout() : renderDefaultLayout();
};

const Gap = styled.div`
  height: 26px;
`;

const TitleColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: -16px -16px 50px -16px;
  padding: 16px 16px 0 16px;
  background-color: white;
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

const Container = styled.div`
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

const CategorizationContainer = styled.div``;
