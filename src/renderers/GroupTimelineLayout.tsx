import { SimpleContainer } from '@aplinkosministerija/design-system';
import { MaterialLayoutRenderer } from '@jsonforms/material-renderers';
import styled from 'styled-components';

export const GroupTimelineLayout = ({
  uischema,
  path,
  schema,
  renderers,
  visible,
  ...rest
}: any) => {
  const layoutProps = {
    elements: uischema.elements,
    visible,
    direction: 'column',
    ...rest,
  };

  if (!visible) return <></>;

  return (
    <GroupContainer>
      <TitleContainer>
        <GroupTitle>{uischema.label}</GroupTitle>
        <GroupDescription dangerouslySetInnerHTML={{ __html: uischema.description }} />
      </TitleContainer>
      <SimpleContainer>
        <SimpleContainerInnerContainer>
          <Line />
          <MaterialLayoutRenderer {...layoutProps} />
        </SimpleContainerInnerContainer>
      </SimpleContainer>
    </GroupContainer>
  );
};

const SimpleContainerInnerContainer = styled.div`
  display: flex;
  gap: 40px;
  position: relative;
`;

const Line = styled.div`
  border-right: 2px dashed #9aa4b2;
  margin: 45px -10px 45px 0;
  width: 10px;
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
