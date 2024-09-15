import { device, useWindowSize } from '@aplinkosministerija/design-system';
import { useNavigate } from 'react-router';
import styled, { useTheme } from 'styled-components';
import Icon, { IconName } from './Icons';

const BackButton = ({ backRoute = '', isWhite = false }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useWindowSize(device.mobileL);

  return (
    <Container
      $color={isWhite ? '#fff' : theme.colors.primary}
      onClick={() => (backRoute ? navigate(backRoute) : navigate(-1))}
    >
      <StyledBackIcon $color={isWhite ? '#fff' : theme.colors.primary} name={IconName.back} />
      {!isMobile ? 'Grįžti atgal' : ''}
    </Container>
  );
};

const StyledBackIcon = styled(Icon)<{ $color?: string }>`
  cursor: pointer;
  margin-right: 4px;
  font-size: 1.6rem;
  align-self: center;
  color: ${({ $color }) => $color ?? '#fff'};
`;

const Container = styled.div<{ $color?: string }>`
  display: flex;
  font-size: 1.6rem;
  flex-direction: row;
  width: fit-content;
  justify-content: center;
  align-items: center;
  border: none;
  color: ${({ $color }) => $color ?? '#fff'};
  gap: 0.4rem;
  cursor: pointer;
`;

export default BackButton;
