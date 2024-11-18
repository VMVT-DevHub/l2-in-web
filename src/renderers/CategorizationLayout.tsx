import { Button } from '@aplinkosministerija/design-system';
import { Categorization, Category, isVisible } from '@jsonforms/core';
import { MaterialLayoutRenderer } from '@jsonforms/material-renderers';
import { JsonFormsStateContext, useJsonForms } from '@jsonforms/react';
import { useState } from 'react';
import styled from 'styled-components';

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
    config: { submitForm },
  }: JsonFormsStateContext = useJsonForms();
  const errors = core?.errors;

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
        <Button disabled={disabled} onClick={() => submitForm({ isDraft: false })}>
          Pateikti
        </Button>
      )}
    </ButtonRow>
  );

  const renderDefaultLayout = () => (
    <CategorizationContainer>
      <Container>{renderTabButtons()}</Container>
      <Gap />
      <MaterialLayoutRenderer {...layoutProps} />
      {renderNavigationButtons()}
    </CategorizationContainer>
  );

  return renderDefaultLayout();
};

const Gap = styled.div`
  height: 26px;
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
