import styled, { keyframes } from 'styled-components';

const Group = ({
  title,
  questions,
  answers,
  display = true,
}: {
  title: string;
  questions: string[];
  answers: (string | number | Date)[];
  display?: boolean;
}) => {
  const normalisedAnswers = answers.map((item) => item.toString() || '');
  return (
    <Main $display={display}>
      <GroupTitle>{title}</GroupTitle>
      <GroupContainer>
        <QuestionContainer>
          {questions.map((q, i) => {
            return <p key={i}>{q}</p>;
          })}
        </QuestionContainer>
        <AnswerContainer>
          {normalisedAnswers.map((a, i) => {
            return <p key={i}>{a}</p>;
          })}
        </AnswerContainer>
      </GroupContainer>
    </Main>
  );
};

export default Group;
const GroupContainer = styled.div`
  display: flex;
  border: 1px solid #e5e7eb;
  padding: 32px;
  width: 80%;
  color: #4a4d5a;
  font-size: 1.4rem;
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
