import { Button, device, Modal } from '@aplinkosministerija/design-system';
import { useState } from 'react';
import styled from 'styled-components';
import FormCard from './FormCard';
import Icon, { IconName } from './Icons';

export interface RequestCardProps {
  onClick: (form: any) => void;
  forms?: any;
  onClose: () => void;
  isVisible: boolean;
  title: string;
}

const FormSelectModal = ({ onClick, forms, onClose, isVisible, title }: RequestCardProps) => {
  const [selectedForm, setSelectedForm] = useState();

  return (
    <Modal visible={isVisible} onClose={onClose}>
      <PopupContainer>
        <Row>
          <Column>
            <Title>{title}</Title>
            <Description>Pasirinkite norimą atlikti veiksmą</Description>
          </Column>
          <IconContainer onClick={onClose}>
            <StyledIcon name={IconName.close} />
          </IconContainer>
        </Row>
        <TypeContainer>
          {forms.map((form: any, index) => (
            <FormCard
              key={`formTypes-${index}`}
              onClick={() => setSelectedForm(form.form)}
              title={form.title}
              description={form.description}
              selected={selectedForm === form.form}
            />
          ))}
        </TypeContainer>
        <ButtonRow>
          <Button variant={'transparent'} onClick={onClose}>{`Atšaukti`}</Button>
          <Button disabled={!selectedForm} onClick={() => onClick(selectedForm)}>{`Tęsti`}</Button>
        </ButtonRow>
      </PopupContainer>
    </Modal>
  );
};

const StyledIcon = styled(Icon)`
  cursor: pointer;
  font-size: 2.2rem;
`;

const IconContainer = styled.div``;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  gap: 116px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.div`
  font-size: 2.4rem;
  font-weight: 600;
  color: black;
`;

const Description = styled.div`
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 21px;
  color: #4a4d5a;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 40px;
`;

const PopupContainer = styled.div<{ width?: string }>`
  background-color: white;
  border: 1px solid #dfdfdf;
  border-radius: 4px;
  position: relative;
  height: fit-content;
  min-width: 440px;
  width: ${({ width }) => width || 'auto'};
  padding: 58px 44px;

  @media ${device.mobileL} {
    min-width: 100%;
    min-height: 100%;
    border-radius: 0px;
  }
`;

const TypeContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
  @media ${device.mobileL} {
    flex-direction: column;
  }
`;

export default FormSelectModal;
