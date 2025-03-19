import { useState } from 'react';
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
  const [currentValue, setCurrentValue] = useState(placeholder);

  const handleValue = (data: string) => {
    setCurrentValue(data);
    setView(!view);
    if (onSelect) {
      onSelect(data);
    }
  };

  return (
    <S.DropDownContainer width={width}>
      <S.DropDownBox
        onClick={() => {
          setView(!view);
        }}>
        {currentValue}
        {view ? <ArrowUp /> : <ArrowDown />}
      </S.DropDownBox>
      {view && (
        <S.DropDownList>
          {dropDownData.map((data, index) => {
            return (
              <S.DropDownItem
                key={index}
                value={data}
                onClick={(e) => {
                  e.stopPropagation();
                  handleValue(data);
                }}>
                {data}
              </S.DropDownItem>
            );
          })}
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
    box-sizing: borderBox;
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
  `,
  DropDownItem: styled.li`
    display: flex;
    justify-content: center;
    cursor: pointer;
    list-style: none;
    padding: ${theme.spacing.xs};
  `,
};
