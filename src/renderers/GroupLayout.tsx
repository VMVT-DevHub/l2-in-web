import { SimpleContainer } from '@aplinkosministerija/design-system';
import { MaterialLayoutRenderer } from '@jsonforms/material-renderers';
import styled from 'styled-components';

export const GroupLayout = ({ uischema, path, schema, renderers, visible, ...rest }: any) => {
  const layoutProps = {
    elements: uischema.elements,
    visible,
    direction: 'column',
    ...rest,
  };

  if (!visible) return <></>;

  if (uischema?.options?.display === 'column') {
    return (
      <GroupColumn>
        <GroupTitle>{uischema.label}</GroupTitle>
        <MaterialLayoutRenderer {...layoutProps} />
      </GroupColumn>
    );
  }

  return (
    <GroupContainer>
      <TitleContainer>
        <GroupTitle>{uischema.label}</GroupTitle>
        <GroupDescription>{uischema.description}</GroupDescription>
      </TitleContainer>
      <SimpleContainer>
        <MaterialLayoutRenderer {...layoutProps} />
      </SimpleContainer>
    </GroupContainer>
  );
};

const GroupColumn = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const GroupTitle = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  color: black;
`;

const GroupDescription = styled.div`
  font-size: 1.4rem;
  font-weight: 400;
  color: #4b5565;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const GroupContainer = styled.div`
  display: grid;
  gap: 32px;
  grid-template-columns: 240px 1fr;
  margin-bottom: 16px;
  @media (max-width: 1130px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;
