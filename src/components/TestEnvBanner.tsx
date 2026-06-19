import { device } from '@aplinkosministerija/design-system';
import { useState } from 'react';
import styled from 'styled-components';

export const TestEnvBanner = () => {
  const isShownInTestOnly = import.meta.env.VITE_SHOW_ALL_REQUESTS === 'true';
  const [displayTestBanner, setDisplayTestBanner] = useState(
    localStorage.getItem('displayTestBanner') || 'true',
  );

  if (!isShownInTestOnly) return <></>;
  if (displayTestBanner == 'false') return <></>;

  const handleBannerDisplay = () => {
    setDisplayTestBanner('false');
    localStorage.setItem('displayTestBanner', 'false');
  };

  return (
    <Container>
      <TextContainer>
        Testinė aplinka. Gamybinę rasite <ProdLink href="https://eportalas.vmvt.lt/">čia</ProdLink>
      </TextContainer>
      <CloseButton
        onClick={() => {
          handleBannerDisplay();
        }}
      ></CloseButton>
    </Container>
  );
};

const CloseButton = styled.button`
  cursor: pointer;
  width: 30px;
`;

const ProdLink = styled.a`
  cursor: pointer;
  text-decoration: underline;
`;

const Container = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  top: 0;
  z-index: 54;
  width: 100%;
`;

const TextContainer = styled.p`
  margin: 0;
  color: white;
  text-align: center;
  padding: 8px 336px;
  border-radius: 0 0 12px 12px;
  background-color: #cd3939e2;
  @media ${device.mobileL} {
    padding: 8px 86px;
    justify-content: center;
  }
  @media ${device.mobileM} {
    padding: 8px 56px;
    justify-content: center;
  }
`;
