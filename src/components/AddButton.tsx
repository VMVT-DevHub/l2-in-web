import styled from 'styled-components';

const AddButton = ({ onClick, children, padding = '0' }) => {
  return (
    <Button onClick={onClick} $padding={padding}>
      {children}
    </Button>
  );
};

const Button = styled.button<{ $color?: string; $padding?: string }>`
  display: flex;
  flex-direction: row;
  border: none;
  padding: ${({ $padding }) => ($padding ? $padding : 0)};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.4rem;
  cursor: pointer;
`;

export default AddButton;
