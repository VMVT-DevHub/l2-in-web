//@ts-ignore
import { Button } from '@aplinkosministerija/design-system';
import styled from 'styled-components';
import Icon, { IconName } from '../components/Icons';

const Login = () => {
  return (
    <Container>
      <InnerContainer>
        <Title>L2</Title>
        <Description>L2 aprašymas</Description>
      </InnerContainer>
      <form action={`/api/auth/sign`} method="POST">
        <input type="hidden" name="appHost" value={window.origin} />
        <Button width="100%" left={<Icon name={IconName.eGate} />} type="submit">
          Prisijungti per El. valdžios vartus
        </Button>
      </form>
    </Container>
  );
};

const Title = styled.div`
  font-size: 6.7rem;
  font-weight: bold;
  color: ${({ theme }) => theme?.colors?.text?.primary};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Description = styled.div`
  color: ${({ theme }) => theme?.colors?.text?.primary};
  font-size: 1.6rem;
  opacity: 1;
`;

export default Login;
