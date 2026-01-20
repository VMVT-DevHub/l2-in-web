import { Button, ButtonMultiSelect } from '@aplinkosministerija/design-system';
import { ArrayLayoutProps, resolveData } from '@jsonforms/core';
import { JsonFormsStateContext, useJsonForms } from '@jsonforms/react';
import styled from 'styled-components';
import { useOptions } from '../utils/hooks';

export const ButtonMultiSelectRerender = ({
  schema,
  uischema,
  path,
  enabled,
  visible,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  handleChange,
  label,
}: ArrayLayoutProps) => {
  const ctx: JsonFormsStateContext = useJsonForms();
  const formData = resolveData(ctx.core?.data, path) || [];

  const options = useOptions({ schema, uischema });
  const props = uischema.options?.props;

  const { selectAllLabel, deselectAllLabel, showSelectAllCount } = props;

  const labelButtonTitle = selectAllLabel
    ? formData.length <= showSelectAllCount
      ? selectAllLabel
      : deselectAllLabel
    : null;

  const toggleSelectOptions = () => {
    if (formData.length <= showSelectAllCount) {
      handleChange(path, options);
    } else {
      handleChange(path, []);
    }
  };

  if (!visible) return <></>;

  return (
    <ButtonMultiSelect
      label={label}
      disabled={!enabled}
      options={options}
      onChange={(values) => handleChange(path, values)}
      values={formData || []}
      labelButton={
        enabled &&
        labelButtonTitle && (
          <StyledButton variant={'transparent'} onClick={toggleSelectOptions}>
            {labelButtonTitle}
          </StyledButton>
        )
      }
      {...props}
    />
  );
};

const StyledButton = styled(Button)`
  font-size: 1.4rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.primary};
  white-space: nowrap;
  border: 1px solid transparent;
  &:hover {
    border: 1px solid transparent;
  }
`;
