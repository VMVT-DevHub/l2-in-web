import { ArrayLayoutProps, composePaths, createDefaultValue, resolveData } from '@jsonforms/core';
import { JsonFormsDispatch, useJsonForms } from '@jsonforms/react';
import { cloneDeep } from 'lodash';
import styled from 'styled-components';
import AddButton from '../components/AddButton';
import { default as Icon, IconName } from '../components/Icons';
import { useEffect } from 'react';

export const ArrayLayout = ({
  uischema,
  path,
  schema,
  rootSchema,
  visible,
  renderers,
  cells,
  data,
  addItem,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  handleChange,
  label,
  removeItems,
  enabled,
  ...rest
}: ArrayLayoutProps) => {
  const ctx = useJsonForms();
  const formData: any[] = resolveData(ctx.core?.data, path);
  const veikla = ctx.core?.data?.veiklos?.veikla;

  useEffect(() => {
    const needsUpdate = formData?.some((item) => item.veikla !== veikla);

    if (needsUpdate && handleChange) {
      const updatedData = formData?.map((item) => ({
        ...item,
        veikla,
      }));

      handleChange(path, updatedData);
    }
  }, [veikla, formData?.length]);

  if (!visible) return <></>;

  const {
    detail,
    addLabel,
    isHorizontal,
    veiklaIsNeeded,
    uniqueFields = [],
  } = uischema.options || {};

  const handleItem = () => {
    if (veiklaIsNeeded) {
      const formValues = createDefaultValue(schema, rootSchema);
      const formwithActionValues = { ...formValues, veikla: veikla };

      addItem(path, formwithActionValues)();
    } else {
      addItem(path, createDefaultValue(schema, rootSchema))();
    }
  };

  const handleRemoveItem = (index: number) => {
    if (removeItems) {
      removeItems(path, [index])();
    }
  };

  const isCombinationUnique = (combination, excludeIndex) => {
    return !formData.some((existingCombination, index) => {
      if (index === excludeIndex) {
        return false;
      }

      return uniqueFields.every((field) => existingCombination[field] === combination[field]);
    });
  };

  return (
    <MainContainer $isHorizontal={isHorizontal}>
      <ArrayContainer $isHorizontal={isHorizontal}>
        {formData?.map((_, i) => {
          const composePath = composePaths(path, `${i}`);

          const handleIconClick = () => {
            if (enabled) handleRemoveItem(i);
          };

          const schemaCopy = uniqueFields.length ? cloneDeep(schema) : schema;

          uniqueFields.forEach((field) => {
            const fieldSchema = schemaCopy?.properties?.[field];

            if (fieldSchema) {
              fieldSchema.enum = fieldSchema.enum.filter((option) =>
                isCombinationUnique({ ...formData[i], [field]: option }, i),
              );
            }
          });
          return (
            <ItemWrapper key={i}>
              <JsonFormsDispatch
                uischema={detail || uischema}
                enabled={enabled}
                path={composePath}
                schema={schemaCopy}
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
            </ItemWrapper>
          );
        })}
      </ArrayContainer>
      {enabled && (
        <AddButton padding={isHorizontal ? '39px 0 0 0' : ''} onClick={handleItem}>
          + {addLabel}
        </AddButton>
      )}
    </MainContainer>
  );
};

const ArrayContainer = styled.div<{ $isHorizontal: boolean }>`
  width: ${({ $isHorizontal }) => ($isHorizontal ? '75%;' : '100%;')};
`;

const MainContainer = styled.div<{ $isHorizontal: boolean }>`
  display: ${({ $isHorizontal }) => ($isHorizontal ? 'flex;' : 'block;')};
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
`;

const ItemWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 20px;
  gap: 1.6rem;

  [tabindex='-1'] {
    flex: 1;
  }
`;

const IconContainer = styled.div`
  margin: auto 0 16px 0px;
  height: 40px;
  display: flex;
  cursor: pointer;
`;

const StyledIcon = styled(Icon)`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 2rem;
  margin: auto 0;
`;

export default ArrayLayout;
