import { device } from '@aplinkosministerija/design-system';
import { isVisible } from '@jsonforms/core';
import { JsonFormsDispatch, JsonFormsStateContext, useJsonForms } from '@jsonforms/react';
import styled from 'styled-components';

export const HorizontalLayout = ({ uischema, path, schema, renderers, visible, ...rest }: any) => {
  const { core }: JsonFormsStateContext = useJsonForms();
  const options = uischema?.options;
  const bottomLabel = options?.bottomLabel;
  const margin = uischema?.options?.margin;
  const margin_bottom = uischema?.options?.margin_bottom;
  const gap = uischema?.options?.gap;

  if (!visible) {
    return <></>;
  }

  const elementsLength =
    options?.columns ||
    uischema.elements.filter((element) => {
      if (!core?.ajv) return false;
      return isVisible(element, core?.data, '', core?.ajv);
    }).length;

  const renderElements = () => {
    return uischema.elements.map((element: any, index: number) => (
      <JsonFormsDispatch
        key={index}
        uischema={element}
        schema={schema}
        path={path}
        renderers={renderers}
        {...rest}
      />
    ));
  };

  return (
    <Container>
      <HorizontalLayoutContainer
        $columns={elementsLength}
        $margin={margin}
        $gap={gap}
        $margin_bottom={margin_bottom}
      >
        {renderElements()}
      </HorizontalLayoutContainer>
      {bottomLabel && <SubTitle>{bottomLabel}</SubTitle>}
    </Container>
  );
};

const SubTitle = styled.div`
  font-size: 1.2rem;
  font-weight: 500;
  line-height: 15.6px;
  color: ${({ theme }) => theme?.colors?.text?.secondary};
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
  width: inherit;
`;

const HorizontalLayoutContainer = styled.div<{
  $columns: number;
  $margin?: string;
  $gap?: string;
  $margin_bottom?: string;
}>`
  display: grid;
  gap: ${({ $gap }) => ($gap ? `${$gap}` : '16px')};
  margin: ${({ $margin }) => ($margin ? `0px ${$margin}` : '0px')};
  margin-bottom: ${({ $margin_bottom }) => ($margin_bottom ? `${$margin_bottom}` : '16px')};
  grid-template-columns: repeat(${({ $columns }) => $columns}, 1fr);
  @media ${device.mobileL} {
    grid-template-columns: 1fr;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
