import { device } from '@aplinkosministerija/design-system';
import Div100vh from 'react-div-100vh';
import styled from 'styled-components';

export interface LoginLayoutProps {
  children?: React.ReactNode;
}

const LoginLayout = ({ children }: LoginLayoutProps) => {
  return (
    <Div100vh>
      <Container>
        <ImageContainer>
          <Image src="/vmvtlogin.png" />
        </ImageContainer>
        <Content>{children}</Content>
      </Container>
    </Div100vh>
  );
};

const ImageContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const Image = styled.img`
  object-fit: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100%;
  width: 100%;
`;

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  margin: auto;
  overflow-y: auto;
  width: 100vw;
  height: 100vh;
`;

const Content = styled.div`
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 100%;
  @media ${device.mobileL} {
    width: 100%;
  }
`;

export default LoginLayout;
