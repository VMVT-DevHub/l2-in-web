import { ControlProps } from '@jsonforms/core';
import styled from 'styled-components';
import { CountryFieldRenderer } from './CountryField';

export const TimelineCountryStartRenderer = ({ visible, ...rest }: ControlProps) => {
  if (!visible) return <></>;

  return (
    <Row>
      <IconContainer>
        <Circle />
      </IconContainer>
      <CountryFieldRenderer visible={visible} {...rest} />
    </Row>
  );
};

const IconContainer = styled.div`
  margin: auto 0 10px 0px;
  height: 40px;
  display: flex;
  position: absolute;
  left: -39px;
  top: 20px;
  z-index: 3;
`;

const Circle = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: white;
  border: 4px solid ${({ theme }) => theme.colors.primary};
  margin-top: auto;
`;

const Row = styled.div`
  position: relative;
  flex: 1;
`;
