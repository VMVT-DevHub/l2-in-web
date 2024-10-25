import { Button, CheckBox, device, Popup, PopupType } from '@aplinkosministerija/design-system';

import React from 'react';
import styled, { useTheme } from 'styled-components';
import { ButtonVariants } from '../styles';
import { buttonLabels } from '../utils/text';

interface Props {
  onClose: () => void;
  visible?: boolean;
  content: {
    title?: string;
    subtitle?: string;
    confirmButtonTitle?: string;
    confirmButtonVariant?: ButtonVariants;
    showCancel?: boolean;
    cancelButtonTitle?: string;
    cancelButtonVariant?: ButtonVariants;
    onConfirm?: () => void;
    onCancel?: () => void;
  };
}

const ConfirmPopup: React.FC<Props> = ({ content, onClose, visible = false }) => {
  const {
    onConfirm,
    onCancel,
    title,
    subtitle,
    confirmButtonVariant,
    cancelButtonVariant,
    confirmButtonTitle,
    cancelButtonTitle,
    showCancel,
  } = content;
  const theme = useTheme();

  return (
    <Popup type={PopupType.CENTER} visible={visible} onClose={onClose}>
      <Container>
        {title && (
          <Title
            $color={
              confirmButtonVariant === ButtonVariants.DANGER
                ? theme.colors.danger
                : theme.colors.primary
            }
          >
            {title}
          </Title>
        )}
        {subtitle && <Description>{subtitle}</Description>}

        <BottomRow>
          {onConfirm && (
            <Button
              variant={confirmButtonVariant ?? ButtonVariants.PRIMARY}
              onClick={() => {
                onClose();
                if (onConfirm) onConfirm();
              }}
            >
              {confirmButtonTitle ?? buttonLabels.confirm}
            </Button>
          )}
          {showCancel && (
            <Button
              variant={cancelButtonVariant ?? ButtonVariants.TRANSPARENT}
              onClick={() => {
                onClose();
                if (onCancel) onCancel();
              }}
            >
              {cancelButtonTitle ?? buttonLabels.cancel}
            </Button>
          )}
        </BottomRow>
      </Container>
    </Popup>
  );
};

const Title = styled.div<{
  $color: string;
}>`
  font-size: 2.4rem;
  text-align: center;
  font-weight: bold;
  margin-bottom: 8px;
  color: ${({ $color }) => $color};
  width: 100%;
`;

const Description = styled.span`
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.primary};
  width: 100%;
  text-align: center;
  white-space: pre-line;
`;

const StyledCheckBox = styled(CheckBox)`
  margin-top: 12px;
`;

const Container = styled.div`
  border-radius: 10px;
  padding: 0px 32px 32px 32px;
  display: flex;
  flex-direction: column;
  position: relative;
  @media ${device.mobileL} {
    padding: 0px 16px 32px 16px;
    justify-content: center;
  }
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin-top: 22px;
  gap: 16px;
  width: 100%;
  div {
    width: 100%;
  }
`;

export default ConfirmPopup;
