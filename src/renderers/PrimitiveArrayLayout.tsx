import { device } from '@aplinkosministerija/design-system';
import { ArrayLayoutProps, composePaths, createDefaultValue, resolveData } from '@jsonforms/core';
import { JsonFormsDispatch, useJsonForms } from '@jsonforms/react';
import styled from 'styled-components';
import AddButton from '../components/AddButton';
import { default as Icon, IconName } from '../components/Icons';

export const PrimitiveArrayLayout = ({
  uischema,
  path,
  schema,
  rootSchema,
  visible,
  renderers,
  cells,
  data,
  addItem,
  //@ts-ignore
  handleChange,
  label,
  removeItems,
  enabled,
  ...rest
}: ArrayLayoutProps) => {
  const ctx = useJsonForms();
  const formData: any[] = resolveData(ctx.core?.data, path);

  if (!visible) return <></>;

  const { detail, addLabel, uniqueItems } = uischema.options || {};

  const handleRemoveItem = (index: number) => {
    if (removeItems) {
      removeItems(path, [index])();
    }
  };

  const isAddButtonVisible = () => {
    return !schema.enum || !formData?.length || schema.enum.length > formData.length;
  };

  const canAddMoreItems = isAddButtonVisible();

  return (
    <MainContainer>
      <Column>
        {formData?.map((item, i) => {
          const composePath = composePaths(path, `${i}`);

          const getOptions = () => {
            if (!schema.enum) return [];
            const options = [...schema.enum];
            if (uniqueItems && formData?.length) {
              const formDataSet = new Set(formData);
              return options.filter((option) => !formDataSet.has(option) || option === item);
            }
            return options;
          };

          const options = getOptions();

          const handleIconClick = () => {
            if (enabled) handleRemoveItem(i);
          };

          return (
            <Container key={i}>
              <JsonFormsDispatch
                uischema={detail || uischema}
                enabled={enabled}
                path={composePath}
                schema={{ ...schema, ...(options.length ? { enum: options } : {}) }}
                cells={cells}
                renderers={renderers}
                {...rest}
              />
              {enabled ? (
                <IconContainer onClick={handleIconClick}>
                  <StyledIcon name={IconName.deleteItem} />
                </IconContainer>
              ) : (
                <div />
              )}
            </Container>
          );
        })}
        {enabled && canAddMoreItems && (
          <AddButton onClick={() => addItem(path, createDefaultValue(schema, rootSchema))()}>
            + {addLabel}
          </AddButton>
        )}
      </Column>
    </MainContainer>
  );
};

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;

  [tabindex='-1'] {
    flex: 1;
  }
  @media ${device.mobileL} {
    flex-direction: column;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 16px;
`;

const IconContainer = styled.div`
  margin: auto 0 10px 0px;
  height: 40px;
  display: flex;
  cursor: pointer;
`;

const MainContainer = styled.div`
  display: grid;
  flex-direction: column;
  gap: 16px;
`;

const StyledIcon = styled(Icon)`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 2rem;
  margin-top: auto;
`;

export default PrimitiveArrayLayout;
