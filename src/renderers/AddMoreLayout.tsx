import styled from 'styled-components';
import AddButton from '../components/AddButton';
import { JsonFormsDispatch } from '@jsonforms/react';
import Icon, { IconName } from '../components/Icons';
import { useEffect } from 'react';

const defaultValues = {
  string: '',
  object: {},
  array: [],
};

export const AddMoreLayout = (props: any) => {
  const { data, uischema, path, schema, enabled, errors, handleChange } = props;

  const { addLabel } = uischema.options || {};
  const defaults = schema.default;

  useEffect(() => {
    if ((!data || !data.length) && defaults) {
      handleChange(path, defaults);
    }
  }, []);

  const handleAdd = () => {
    const { default: defaultItem, type } = schema.items;
    handleChange(path, [...(data || []), defaultItem || defaultValues[type]]);
  };
  const handleRemove = (index) => {
    const d = data?.filter((_, i) => i !== index);
    handleChange(path, d);
  };

  return (
    <MainContainer>
      {data?.map((item, index) => {
        return (
          <ItemWrapper key={`more_item_${index}`}>
            <JsonFormsDispatch
              schema={schema.items}
              uischema={uischema.options?.detail || uischema}
              path={`${path}.${index}`}
            />
            {enabled ? (
              <IconContainer onClick={() => handleRemove(index)}>
                <StyledIcon name={IconName.deleteItem} />
              </IconContainer>
            ) : (
              <div />
            )}
          </ItemWrapper>
        );
      })}
      {enabled && <AddButton onClick={handleAdd}>+ {addLabel}</AddButton>}
    </MainContainer>
  );
};

const MainContainer = styled.div`
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
