import { createFileRoute } from '@tanstack/react-router';
import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import SelectArrowIcon from '@/assets/arrow_drop_up.svg?react';

export const Route = createFileRoute(
  '/_sideBarLayout/my-project/_components/dropdownSelect'
)({
  component: DropdownSelect,
});

interface IDropdownProps {
  placeholder?: string;
  options: string[];
  width?: string;
  /* eslint-disable no-unused-vars */
  onSelect: (value: string) => void;
}

function DropdownSelect({
  placeholder,
  options,
  width = '100%',
  onSelect,
}: IDropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    onSelect(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener('click', handleClickOutside);
    }

    return () => window.removeEventListener('click', handleClickOutside);
  }, [isOpen]);
  return (
    <S.DropdownWrap
      width={width}
      ref={ref}>
      <S.SelectedBox onClick={() => setIsOpen(!isOpen)}>
        {selectedOption || placeholder}

        {isOpen ? (
          <SelectArrowIcon color="#555" />
        ) : (
          <SelectArrowIcon
            color="#555"
            style={{ transform: 'rotate(180deg)' }}
          />
        )}
      </S.SelectedBox>
      {isOpen && (
        <S.OptionItems>
          {options.map((option, index) => (
            <S.OptionItem
              key={index}
              onClick={() => handleSelect(option)}>
              {option}
            </S.OptionItem>
          ))}
        </S.OptionItems>
      )}
    </S.DropdownWrap>
  );
}

export default DropdownSelect;

const S = {
  DropdownWrap: styled.div<{ width: string }>`
    position: relative;
    width: ${({ width }) => width};
  `,
  SelectedBox: styled.div`
    padding: 10px 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: ${({ theme }) => theme.fontSizes.fz14};
    color: ${({ theme }) => theme.colors.text};

    svg {
      transition: all 0.3s;
    }
  `,
  OptionItems: styled.ul`
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
    margin: 5px 0 0;
    padding: 0;
    list-style: none;
    border: 1px solid ${({ theme }) => theme.colors.lightGray2};
    border-radius: ${({ theme }) => theme.radius.xsmall};
    background: ${({ theme }) => theme.colors.white};
    z-index: 10;
  `,
  OptionItem: styled.li`
    padding: 10px 15px;
    cursor: pointer;
    font-size: ${({ theme }) => theme.fontSizes.fz14};
    color: ${({ theme }) => theme.colors.text};

    &:hover {
      background: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.white};
    }
  `,
};
