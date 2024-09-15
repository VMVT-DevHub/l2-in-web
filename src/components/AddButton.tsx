import styled from 'styled-components';

const AddButton = ({ onClick, children }) => {
  return <Button onClick={onClick}>{children}</Button>;
};

const Button = styled.button<{ $color?: string }>`
  margin-top: 16px;
  display: flex;
  flex-direction: row;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.4rem;
  cursor: pointer;
`;

export default AddButton;
