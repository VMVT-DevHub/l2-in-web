import styled, { keyframes } from 'styled-components';

const GroupParagraph = ({
  title,
  text,
  display = true,
}: {
  title: string;
  text: string;
  display?: boolean;
}) => {
  return (
    <Main $display={display}>
      <GroupTitle>{title}</GroupTitle>
      <GroupContainer>
        <p>{text}</p>
      </GroupContainer>
    </Main>
  );
};

export default GroupParagraph;

const GroupContainer = styled.div`
  display: flex;
  border: 1px solid #e5e7eb;
  padding: 32px;
  width: 80%;
  color: #4a4d5a;
  font-size: 1.4rem;
  text-align: justify;
  & p {
    margin: 0;
  }
`;
const AnswerContainer = styled.div`
  width: 50%;
  & p {
    margin: 0;
  }

  & p:not(:first-child) {
    margin-top: 16px;
  }
`;
const QuestionContainer = styled.div`
  width: 50%;
  & p {
    margin: 0;
  }
  & p:not(:first-child) {
    margin-top: 16px;
  }
`;
const GroupTitle = styled.p`
  font-weight: bold;
  width: 20%;
  margin: 0;
`;
const Main = styled.div<{ $display }>`
  display: ${({ $display }) => ($display ? 'flex' : 'none')};
  margin-top: 32px;
  gap: 20px;
`;
