import { Button, CreatableMultiSelect, device, Modal } from '@aplinkosministerija/design-system';
import {
  ArrayLayoutProps,
  composePaths,
  createDefaultValue,
  resolveData,
  toDataPath,
} from '@jsonforms/core';
import { JsonForms, JsonFormsDispatch, useJsonForms } from '@jsonforms/react';
import React, { useState } from 'react';
import styled from 'styled-components';
import AddButton from '../components/AddButton';
import Icon, { IconName } from '../components/Icons';

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
  //@ts-ignore
  handleChange,
  label,
  removeItems,
  translations,
  enabled,
  ...rest
}: ArrayLayoutProps) => {
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | undefined>();
  const [values, setValues] = useState<any>({});
  const [errors, setErrors] = useState<any>([]);
  const ctx = useJsonForms();
  const formData = resolveData(ctx.core?.data, path);

  if (!visible) return null;
  const cardInfo = uischema?.options?.card;
  const { detail, display, addLabel } = uischema.options || {};

  const elements = Array.isArray(detail?.elements) ? detail.elements : detail ? [detail] : [];

  const isCategorization = detail?.type === 'Categorization';
  const isModal = display === 'modal';
  const isCreatableMultiSelect = display === 'creatableMultiSelect';

  const handleAddItem = () => {
    setCurrentIndex(formData?.length || 0);
    setValues({});
    setShowModal(true);
  };

  const handleRemoveItem = (index: number) => {
    removeItems?.(path, [index])();
  };

  const renderFormElements = (composePath: string) => (
    <>
      {elements.map((element, index) => (
        <JsonFormsDispatch
          key={index}
          uischema={element}
          enabled={enabled}
          path={composePath}
          schema={schema}
          cells={cells}
          renderers={renderers}
          {...rest}
        />
      ))}
    </>
  );

  const renderModalContent = () => (
    <>
      <CardContainer>
        {formData?.map((item, i) => {
          const title = resolveData(item, toDataPath(cardInfo?.title?.scope));
          const code = cardInfo?.code ? resolveData(item, toDataPath(cardInfo?.code?.scope)) : '';
          const rightTop = cardInfo.right
            ? resolveData(item, toDataPath(cardInfo?.right?.scope))
            : '';
          const rightTopInfix = cardInfo?.right?.dynamicInfix
            ? resolveData(item, toDataPath(cardInfo?.right?.dynamicInfix.scope))
            : '';
          const rightTopLabel = cardInfo?.right?.label || '';

          return (
            <Card
              key={i}
              onClick={() => {
                setCurrentIndex(i);
                setValues(formData[i] || {});
                setShowModal(true);
              }}
            >
              <CardTopRow>
                <CardInnerRow>
                  <CardTitle>
                    {title}
                    {code && <CardCode> #{code}</CardCode>}
                  </CardTitle>
                  {cardInfo.top && (
                    <Row>
                      {cardInfo.top.map((info) => {
                        const svg = info?.svg;
                        const value = resolveData(item, toDataPath(info?.scope));

                        const infix = info?.infix
                          ? info.infix
                          : info?.dynamicInfix
                          ? resolveData(item, toDataPath(info.dynamicInfix.scope))
                          : '';

                        if (!value) return <></>;

                        return (
                          <CardTopItem>
                            <ItemIcon src={`data:image/svg+xml;base64,${btoa(svg)}`} />
                            <CardTopItemLabel>
                              {value} {infix}
                            </CardTopItemLabel>
                          </CardTopItem>
                        );
                      })}
                    </Row>
                  )}
                </CardInnerRow>

                {rightTop && (
                  <CardTopRightItem>
                    <CardTopRight>
                      {rightTop}
                      {rightTopInfix}
                    </CardTopRight>
                    <CardBottomItemLabel>{rightTopLabel}</CardBottomItemLabel>
                  </CardTopRightItem>
                )}
              </CardTopRow>

              {cardInfo.top && <Line />}

              {cardInfo.bottom && (
                <Row>
                  {cardInfo.bottom.map((info) => {
                    const value = resolveData(item, toDataPath(info?.scope));
                    const label = info.label;

                    if (!value) return <></>;

                    return (
                      <CardBottomItem>
                        <CardBottomItemLabel>{label}</CardBottomItemLabel>
                        <CardBottomItemValue>{value}</CardBottomItemValue>
                      </CardBottomItem>
                    );
                  })}
                </Row>
              )}
            </Card>
          );
        })}
      </CardContainer>

      <Modal onClose={() => setShowModal(false)} visible={showModal}>
        <PopupContainer>
          <PopupTitle>{addLabel}</PopupTitle>
          {isCategorization ? (
            <JsonForms
              config={{
                submitForm: () => {
                  if (typeof currentIndex !== 'undefined') {
                    handleChange(`${path}.${currentIndex}`, values);
                  } else {
                    addItem(path, values)();
                  }

                  setShowModal(false);
                },
              }}
              onChange={({ data, errors }) => {
                console.log(errors, 'errors');
                setValues(data);
              }}
              uischema={detail}
              //@ts-ignore
              schema={{ ...schema, definitions: ctx.core?.schema.definitions }}
              cells={cells}
              renderers={renderers!}
              data={values}
              readonly={!enabled}
            />
          ) : (
            <>
              <JsonForms
                onChange={({ data, errors }) => {
                  setValues(data);
                  setErrors(errors);
                }}
                //@ts-ignore
                uischema={{ type: 'Category', elements }}
                //@ts-ignore
                schema={{ ...schema, definitions: ctx.core?.schema.definitions }}
                cells={cells}
                renderers={renderers!}
                data={values}
                readonly={!enabled}
              />
              <Button
                disabled={!!Object.keys(errors).length}
                onClick={() => {
                  if (typeof currentIndex !== 'undefined') {
                    handleChange(`${path}.${currentIndex}`, values);
                  } else {
                    addItem(path, values)();
                  }
                  setShowModal(false);
                }}
              >
                Pateikti
              </Button>
            </>
          )}
        </PopupContainer>
      </Modal>
    </>
  );

  const renderItems = () => (
    <Container columns={elements.length}>
      {formData?.map((_, i) => {
        const composePath = composePaths(path, `${i}`);
        return (
          <React.Fragment key={i}>
            {renderFormElements(composePath)}
            {enabled ? (
              <IconContainer onClick={() => handleRemoveItem(i)}>
                <StyledIcon name={IconName.deleteItem} />
              </IconContainer>
            ) : (
              <div />
            )}
          </React.Fragment>
        );
      })}
    </Container>
  );

  if (isCreatableMultiSelect) {
    return (
      <CreatableMultiSelect
        disabled={!enabled}
        label={label}
        onChange={(values) => handleChange(path, values)}
        values={formData || []}
      />
    );
  }

  return (
    <>
      {isModal ? renderModalContent() : renderItems()}
      {enabled && (
        <AddButton
          onClick={() =>
            isModal ? handleAddItem() : addItem(path, createDefaultValue(schema, rootSchema))()
          }
        >
          + {addLabel}
        </AddButton>
      )}
    </>
  );
};

const PopupContainer = styled.div<{ width?: string }>`
  background-color: white;
  border: 1px solid #dfdfdf;
  border-radius: 4px;
  position: relative;
  height: fit-content;
  min-width: 440px;
  width: ${({ width }) => width};
  padding: 20px;

  background-color: white;
  flex-basis: auto;
  margin: auto;

  @media ${device.mobileL} {
    min-width: 100%;
    min-height: 100%;
    border-radius: 0px;
  }
`;
const PopupTitle = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  color: black;
  line-height: 24px;
  margin-bottom: 20px;
`;

const CardTitle = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  line-height: 19.36px;
  color: black;
`;

const CardTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Row = styled.div`
  display: flex;
  gap: 16px;
  @media ${device.mobileL} {
    flex-direction: column;
  }
`;

const ItemIcon = styled.img``;

const CardTopItemLabel = styled.div`
  font-size: 1.4rem;
  font-weight: 400;
`;

const CardTopRight = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #003d2b;
`;

const CardTopRightItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
`;

const Line = styled.div`
  background-color: #eaeaef;
  width: 100%;
  height: 1px;
`;

const CardTopItem = styled.div`
  display: flex;
  gap: 8px;
  color: #4b5565;
`;

const CardBottomItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CardBottomItemLabel = styled.div`
  font-size: 1.2rem;
  font-weight: 400;
  color: #8e93a2;
`;

const CardBottomItemValue = styled.div`
  font-size: 1.2rem;
  font-weight: 400;
  color: #344054;
`;

const CardCode = styled.span`
  font-size: 1.6rem;
  font-weight: 600;
  color: #636a7a;
`;

const Container = styled.div<{ columns: number }>`
  display: grid;
  gap: 16px;
  margin-bottom: 16px;
  grid-template-columns: repeat(${({ columns }) => columns}, 1fr) 40px;

  @media ${device.mobileL} {
    grid-template-columns: 1fr;
  }
`;

const IconContainer = styled.div`
  margin: auto 0 10px 0px;
  height: 40px;
  display: flex;
  cursor: pointer;
`;

const CardInnerRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Card = styled.div`
  background-color: white;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid #eaeaef;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledIcon = styled(Icon)`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 2rem;
  margin-top: auto;
`;

export default ArrayLayout;
