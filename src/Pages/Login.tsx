//@ts-ignore
import { Button, device } from '@aplinkosministerija/design-system';
import { useState } from 'react';
import styled from 'styled-components';
import Icon, { IconName } from '../components/Icons';

const Login = () => {
  const [loading, setLoading] = useState(false);
  return (
    <Container>
      <StyledIcon name={IconName.logoLogin} />
      <InnerContainer>
        <Description>
          Valstybinės maisto ir veterinarijos tarnybos <b>ePortalas</b> – Jūsų patogi prieiga prie
          paslaugų!
        </Description>
      </InnerContainer>
      <form
        style={{ width: '100%' }}
        action={`/api/auth/sign`}
        onSubmit={() => setLoading(true)}
        method="POST"
      >
        <input type="hidden" name="appHost" value={window.origin} />
        <CustomButton
          width="100%"
          disabled={loading}
          loading={loading}
          left={<Icon name={IconName.eGate} />}
          type="submit"
        >
          Prisijungti per El. valdžios vartus
        </CustomButton>
      </form>
    </Container>
  );
};

const CustomButton = styled(Button)`
  border-radius: 4px;
  background-color: #2463eb;
  width: 100%;
`;

const StyledIcon = styled(Icon)``;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 56px 40px;
  gap: 26px;
  border-radius: 8px;
  background-color: white;
  max-width: 430px;
  @media ${device.mobileL} {
    padding: 32px 20px;
  }
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
  font-weight: 400;
  line-height: 22px;
  text-align: center;
`;

export default Login;
