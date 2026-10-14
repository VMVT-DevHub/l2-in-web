import styled from 'styled-components';
import { filterSelectedOptions, handleRemove } from '../utils/functions';
import { useSelectData } from '../utils/hooks';
import OptionsContainer from './OptionsContainer';
import Icon from '../components/Icons';
import { FieldWrapper, MultiTextField } from '@aplinkosministerija/design-system';

export interface SelectOption {
  id?: string | number;
  label?: string;
  [key: string]: any;
}

export interface SelectFieldProps {
  label?: string;
  values: any[];
  error?: string;
  options: SelectOption[] | string[];
  onChange: (option: any) => void;
  disabled?: boolean;
  hasBorder?: boolean;
  descriptions?: { string: string };
  description?: string;
  handleMouseOver: (option: any) => void;
  getOptionLabel?: (option: any) => string | JSX.Element;
  getOptionValue?: (option: any) => any;
  refreshOptions?: (id?: string) => any;
  dependantId?: string;
  renderDetail?: (item: any) => React.ReactNode;
}

const MultiSelectFieldCardDisplay = ({
  label,
  values = [],
  error,
  options,
  handleMouseOver,
  onChange,
  renderDetail,
  descriptions,
  description,
  disabled = false,
  getOptionLabel = (option) => option.label,
  getOptionValue = (option) => option.id,
  refreshOptions,
  dependantId,
}: SelectFieldProps) => {
  const getDropdownLabel = (option: any) => {
    const code = typeof option === 'string' ? option : option?.label;
    const info = descriptions?.[code];
    return info ? `${code} – ${info}` : code;
  };
  const {
    suggestions,
    input,
    handleToggleSelect,
    showSelect,
    handleBlur,
    handleClick,
    handleOnChange,
    loading,
  } = useSelectData({
    options,
    disabled,
    getOptionLabel: getDropdownLabel,
    refreshOptions,
    dependantId,
    value: values,
    onChange: (option) => onChange([...values, option]),
  });

  return (
    <>
      <FieldWrapper
        onClick={handleToggleSelect}
        label={label}
        error={error}
        handleBlur={handleBlur}
      >
        <MultiTextField
          values={values}
          label={label}
          input={input || ''}
          error={error}
          onRemove={({ index }) => {
            handleRemove(index, onChange, values);
          }}
          disabled={disabled}
          handleInputChange={handleOnChange}
          getOptionLabel={getOptionLabel}
        />
        <OptionsContainer
          options={filterSelectedOptions(suggestions, values, getOptionValue)}
          handleMouseOver={handleMouseOver}
          getOptionLabel={getDropdownLabel}
          description={description}
          showSelect={showSelect}
          handleClick={handleClick}
          loading={loading}
        />
      </FieldWrapper>
      {values.map((item, index) => (
        <ValueContainer key={item}>
          <HeaderRow>
            <TitleContainer>
              <ItemTitle>{item}</ItemTitle>
              <p>{descriptions && descriptions[item]}</p>
            </TitleContainer>
            <DeleteButton onClick={() => handleRemove(index, onChange, values)}>
              <StyledIcon name="delete" />
            </DeleteButton>
          </HeaderRow>
          {renderDetail && <DetailRow>{renderDetail(item)}</DetailRow>}
        </ValueContainer>
      ))}
    </>
  );
};

export default MultiSelectFieldCardDisplay;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 16px;
`;
const ItemTitle = styled.div`
  background-color: #e8eeef;
  padding: 6px 6px 6px 9px;
  border-radius: 4px;
  margin-right: 16px;
`;

const DeleteButton = styled.button`
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

const StyledIcon = styled(Icon)`
  width: 25px;
  height: 25px;
  color: ${({ theme }) => theme?.colors?.fields?.border};
  &:hover {
    opacity: 0.6;
  }

  svg {
    width: 25px;
    height: 25px;
  }
`;

const ValueContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme?.colors?.fields?.border};
  border-radius: 4px;
`;
const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const DetailRow = styled.div`
  &:empty {
    display: none;
  }
`;
