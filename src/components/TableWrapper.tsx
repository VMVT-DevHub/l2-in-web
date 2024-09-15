import styled from 'styled-components';

interface PageWrapperProps {
  children: any;
  title: string;
  buttons?: JSX.Element | null;

  className?: string;
}

const TableWrapper = ({ children, title, buttons, className }: PageWrapperProps) => {
  return (
    <Container className={className}>
      <Row>
        <Title>{title}</Title>
        {buttons}
      </Row>
      <>{children}</>
    </Container>
  );
};

const Container = styled.div`
  margin: 0 20px 20px 20px;
`;

const Title = styled.div`
  font-size: 2rem;
  font-weight: bold;
  line-height: 26px;
  letter-spacing: 0px;
  color: #231f20;
  margin-right: 16px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  margin: 22px 0px 33px 0px;
`;

export default TableWrapper;
