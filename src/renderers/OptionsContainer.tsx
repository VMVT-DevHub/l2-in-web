import { JSX, useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import LoaderComponent from './LoaderComponent';
import { useKeyAction } from '../utils/hooks';
import { Tooltip } from '@mui/material';

export interface SelectOption {
  id?: string;
  label?: string;
  [key: string]: any;
}

export interface OptionContainerTexts {
  noOptions: string;
  resultsCount?: (count: number) => string;
}

export interface OptionsContainerProps {
  options?: any[];
  disabled?: boolean;
  getOptionLabel: (option: any) => string | JSX.Element;
  handleScroll?: (option: any) => any;
  loading?: boolean;
  showSelect: boolean;
  description?: string;
  handleClick: (option: any) => any;
  handleMouseOver: (option: any) => any;
  texts?: OptionContainerTexts;
  observerRef?: any;
  className?: string;
  name?: string;
  getOptionId?: (option: any) => string | number;
  activeOptionId?: string;
}

const OptionsContainer = ({
  options = [],
  disabled = false,
  getOptionLabel,
  handleClick,
  handleMouseOver,
  description,
  showSelect,
  observerRef,
  loading,
  texts = {
    resultsCount: (count) => `${count} rezultatai`,
    noOptions: 'Nėra pasirinkimų',
  },
  className,
  name = '',
  getOptionId = (option) => option?.id ?? option,
  activeOptionId,
}: OptionsContainerProps) => {
  const display = showSelect && !disabled;
  const optionsLength = options.length;
  const handleKeyDown = useKeyAction(handleClick);

  const renderOptions = () => {
    if (!options.length) {
      return loading ? (
        <LoaderComponent />
      ) : (
        <Option key="no-options" role="option" aria-disabled="true">
          {texts?.noOptions}
        </Option>
      );
    }

    return (
      <>
        {options.map((option, index) => {
          const optionId = `${name}-option-${getOptionId(option)}`;
          const isActive = activeOptionId === optionId;

          return (
            <Tooltip
              title={description}
              key={optionId}
              arrow
              placement="right"
              disableInteractive
              slotProps={{
                tooltip: {
                  sx: {
                    fontSize: '1.3rem',
                    padding: '8px',
                  },
                },
                popper: {
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [0, 10],
                      },
                    },
                  ],
                },
              }}
            >
              <Option
                id={optionId}
                key={JSON.stringify(option) + index}
                role="option"
                tabIndex={0}
                aria-selected={isActive}
                onClick={() => handleClick(option)}
                onMouseOver={() => handleMouseOver(option)}
                onKeyDown={handleKeyDown(option)}
              >
                {getOptionLabel(option)}
              </Option>
            </Tooltip>
          );
        })}
        {loading && <LoaderComponent />}
      </>
    );
  };

  return (
    <>
      <Wrapper>
        {display && (
          <OptionContainer
            className={className}
            role="listbox"
            aria-hidden={!display}
            aria-disabled={disabled}
          >
            {renderOptions()}
            {observerRef && <ObserverRef ref={observerRef} aria-hidden={!display} />}
          </OptionContainer>
        )}
      </Wrapper>
      <OptionsLength aria-live="polite" aria-atomic="true">
        {optionsLength > 0 ? texts?.resultsCount?.(optionsLength) : texts?.noOptions}
      </OptionsLength>
    </>
  );
};

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const OptionsLength = styled.div`
  position: absolute;
  height: 1px;
  width: 1px;
  overflow: hidden;
  white-space: nowrap;
`;

const OptionContainer = styled.div`
  position: absolute;
  z-index: 29;
  width: 100%;
  padding: 10px 0px;
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  border: none;
  background: ${({ theme }) => theme.colors.dropDown?.background || '#ffffff'} 0% 0% no-repeat
    padding-box;
  box-shadow: 0px 2px 16px #121a5529;

  > * {
    &:first-child {
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }
    &:last-child {
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
`;

const Option = styled.div`
  cursor: pointer;
  font-size: 1.6rem;
  line-height: 20px;
  padding: 8px 12px;
  color: ${({ theme }) => theme.colors.dropDown?.label || '#101010'};

  &:hover {
    background: ${({ theme }) => theme.colors.dropDown?.hover || '#f3f3f7'} 0% 0% no-repeat
      padding-box;
  }

  &:focus {
    outline: 1px solid ${({ theme }) => theme.colors.primary};
  }
`;

const ObserverRef = styled.div``;

export default OptionsContainer;
