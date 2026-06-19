import styled from 'styled-components';

export const TestEnvBanner = () => {
  const isShownInTestOnly = import.meta.env.VITE_SHOW_ALL_REQUESTS === 'true';

  if (!isShownInTestOnly) return;

  return (
    <Container>
      <TextContainer>
        Testinė aplinka. Gamybinę rasite <ProdLink href="https://eportalas.vmvt.lt/">čia</ProdLink>
      </TextContainer>
    </Container>
  );
};

const ProdLink = styled.a`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Container = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  top: 0;
  z-index: 54;
  width: 100%;
`;

const TextContainer = styled.div`
  color: white;
  text-align: center;
  background-color: #952a2acf;
  padding: 6px 12px;
  border-radius: 0 0 12px 12px;
`;
