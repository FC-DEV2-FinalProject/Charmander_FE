import theme from '@/styles/theme';
import React, { useState, useRef } from 'react';
import styled from 'styled-components';

interface ScriptTermInputProps {
  value: string;
  // eslint-disable-next-line no-unused-vars
  setValue: (value: string) => void;

  onBlur: () => void;
}

const ScriptTermInput = ({ value, setValue, onBlur }: ScriptTermInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/[^0-9.]/g, '');
    let parsedValue = parseFloat(inputValue);

    if (isNaN(parsedValue)) {
      parsedValue = 0;
    } else if (parsedValue > 10) {
      parsedValue = 10;
    }

    const formattedValue =
      parsedValue % 1 === 0 ? `${parsedValue}` : `${parsedValue.toFixed(1)}`;
    setValue(formattedValue);
  };

  return (
    <S.InputContainer isFocused={isFocused}>
      <S.Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          onBlur();
          setIsFocused(false);
        }}
      />
      <S.Text>초</S.Text>
    </S.InputContainer>
  );
};

export default ScriptTermInput;

const S = {
  InputContainer: styled.div<{ isFocused: boolean }>`
    display: flex;
    align-items: center;
    width: 100%;
    padding: ${theme.spacing.sm};
    border: ${({ isFocused }) =>
      isFocused
        ? `2px solid ${theme.colors.secondary1}`
        : `1px solid ${theme.colors.border2}`};
    border-radius: ${theme.radius.small};
  `,
  Input: styled.input`
    width: 90%;
    font-size: 16px;
    text-align: right;
    border: 0;
    &:focus {
      outline: none;
    }
  `,
  Text: styled.span`
    font-size: 16px;
    margin-left: 4px;
  `,
};
