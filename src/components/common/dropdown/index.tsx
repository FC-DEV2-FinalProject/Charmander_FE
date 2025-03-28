import { useEffect, useRef, useState } from 'react';
import type { DropDownProps } from '@/types/commonUi';
import ArrowDown from '@/assets/arrow_drop_down.svg?react';
import ArrowUp from '@/assets/arrow_drop_up.svg?react';
import styled from 'styled-components';
import theme from '@/styles/theme';

const DropDown = ({
  placeholder,
  dropDownData,
  width,
  onSelect,
}: DropDownProps) => {
  const [view, setView] = useState<boolean>(false);
  const [currentValue, setCurrentValue] = useState(
    placeholder ||
      (typeof dropDownData[0] === 'object' && 'name' in dropDownData[0]
        ? dropDownData[0].name
        : dropDownData[0])
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setView(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleValue = (data: { id: number; name: string } | string) => {
    if (typeof data === 'object' && 'id' in data) {
      setCurrentValue(data.name);
      onSelect?.(data.id.toString());
    } else {
      setCurrentValue(data);
      onSelect?.(data);
    }
    setView(false);
  };
  return (
    <S.DropDownContainer
      ref={dropdownRef}
      width={width}>
      <S.DropDownBox
        onClick={() => {
          setView(!view);
        }}>
        {currentValue}
        {view ? <ArrowUp /> : <ArrowDown />}
      </S.DropDownBox>
      {view && (
        <S.DropDownList>
          {dropDownData.length > 0 &&
            dropDownData.map((data, index) => (
              <S.DropDownItem
                key={typeof data === 'object' && 'id' in data ? data.id : index}
                onClick={(e) => {
                  e.stopPropagation();
                  handleValue(data);
                }}>
                {typeof data === 'object' && 'name' in data ? data.name : data}
              </S.DropDownItem>
            ))}
        </S.DropDownList>
      )}
    </S.DropDownContainer>
  );
};

export default DropDown;

const S = {
  DropDownContainer: styled.div<{ width?: string }>`
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    width: ${(props) => props.width || 'max-content'};
    font-size: ${theme.fontSizes.fz20};
    font-weight: ${theme.fontWeights.medium};
  `,
  DropDownBox: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: ${theme.spacing.md};
    border: ${theme.borderWidth.thin} solid ${theme.colors.black};
    border-radius: ${theme.radius.small};
    cursor: pointer;
    background-color: ${theme.colors.white};
  `,
  DropDownList: styled.ul`
    position: absolute;
    left: 0;
    top: 100%;
    width: 100%;
    margin-top: ${theme.spacing.xs};
    padding: ${theme.spacing.xs};
    border: ${theme.borderWidth.thin} solid ${theme.colors.black};
    border-radius: ${theme.radius.small};
    background-color: ${theme.colors.white};
    box-shadow: ${theme.boxShadow.regular};
    box-sizing: border-box;
    z-index: 1;
    overflow: auto;
    max-height: 200px;
  `,
  DropDownItem: styled.li`
    display: flex;
    justify-content: center;
    cursor: pointer;
    list-style: none;
    padding: ${theme.spacing.xs};
    &:hover {
      background-color: ${theme.colors.background2};
    }
  `,
};
