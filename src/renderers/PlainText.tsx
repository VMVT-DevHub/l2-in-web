import { ControlProps } from '@jsonforms/core';
import styled from 'styled-components';

export const PlainTextRenderer = ({ label }: ControlProps) => {
  return <PlainText>{label}</PlainText>;
};

const PlainText = styled.p`
  font-size: 1.4rem;
  color: #4b5565;
`;
