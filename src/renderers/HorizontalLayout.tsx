import { device } from '@aplinkosministerija/design-system';
import { isVisible } from '@jsonforms/core';
import { JsonFormsDispatch, JsonFormsStateContext, useJsonForms } from '@jsonforms/react';
import styled from 'styled-components';

export const HorizontalLayout = ({ uischema, path, schema, renderers, visible, ...rest }: any) => {
  const { core }: JsonFormsStateContext = useJsonForms();

  if (!visible) {
    return <></>;
  }

  const elementsLength = uischema.elements.filter((element) => {
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
    <HorizontalLayoutContainer $columns={elementsLength}>
      {renderElements()}
    </HorizontalLayoutContainer>
  );
};

const HorizontalLayoutContainer = styled.div<{ $columns: number }>`
  display: grid;
  gap: 16px;
  margin-bottom: 16px;
  grid-template-columns: repeat(${({ $columns }) => $columns}, 1fr);

  @media ${device.mobileL} {
    grid-template-columns: 1fr;
  }
`;
