import { useState } from 'react';
import styled from 'styled-components';
import Icon, { IconName } from './Icons';

export interface RequestCardProps {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const FormCard = ({
  title,
  selected,
  description,
  onClick,
  disabled = false,
}: RequestCardProps) => {
  const [onHover, setOnHover] = useState(false);

  return (
    <Container
      selected={selected || onHover}
      onClick={() => !disabled && onClick()}
      disabled={disabled}
      onMouseEnter={() => !disabled && setOnHover(true)}
      onMouseLeave={() => !disabled && setOnHover(false)}
    >
      {selected && <StyledIcon name={IconName.checkmark} />}
      <Column>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </Column>
    </Container>
  );
};

const Container = styled.div<{ selected: boolean; disabled: boolean }>`
  flex: 1;
  background-color: ${({ selected, theme }) => (selected ? theme?.colors?.hover?.card : 'white')};
  position: relative;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  opacity: ${({ disabled }) => (disabled ? 0.48 : 1)};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  border-radius: 8px;
  padding: 32px 24px;
  border-color: ${({ theme, selected }) => (selected ? theme.colors.primary : theme.colors.border)};

  ${({ disabled }) =>
    !disabled &&
    `
    :hover {
    background-color:${({ theme }) => theme.colors?.hover?.card};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`};
`;

const StyledIcon = styled(Icon)`
  color: white;
  background-color: ${({ theme }) => theme.colors.primary};
  width: 20px;
  height: 20px;
  border-radius: 50%;
  padding: 3px;
  position: absolute;
  top: 10px;
  right: 10px;
`;

const Row = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Description = styled.div`
  font-size: 1.2rem;
  line-height: 15px;
  color: #121926;
`;

const Title = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
  color: #121926;
`;

export default FormCard;
