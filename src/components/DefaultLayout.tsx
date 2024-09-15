import { device, useWindowSize } from '@aplinkosministerija/design-system';
import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import MobileNavbar from './MobileNavBar';
import SideBar from './SideBar';

export interface DefaultLayoutProps {
  children?: any;
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  const isTablet = useWindowSize(device.mobileL);

  return (
    <Container>
      {isTablet ? <MobileNavbar /> : <SideBar />}

      <ToastContainer />
      <Content>{children}</Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;

  @media ${device.mobileL} {
    overflow-y: auto;
    flex-direction: column;
    height: 100svh; //fixes iOS Safari floating address bar problem
  }
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

export default DefaultLayout;
