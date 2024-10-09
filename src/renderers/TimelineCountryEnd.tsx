import { ControlProps } from '@jsonforms/core';
import styled from 'styled-components';
import Icon, { IconName } from '../components/Icons';
import { CountryFieldRenderer } from './CountryField';

export const TimelineCountryEndRenderer = ({ visible, ...rest }: ControlProps) => {
  if (!visible) return <></>;

  return (
    <Row>
      <IconContainer>
        <StyledIcon name={IconName.location} />
      </IconContainer>
      <CountryFieldRenderer visible={visible} {...rest} />
    </Row>
  );
};

const StyledIcon = styled(Icon)`
  margin-top: auto;
`;

const IconContainer = styled.div`
  margin: auto 0 10px 0px;
  height: 40px;
  display: flex;
  position: absolute;
  left: -41px;
  top: 40px;
  z-index: 10;
  background-color: white;
`;

const Row = styled.div`
  position: relative;
  flex: 1;
`;
