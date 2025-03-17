import theme from '@/styles/theme';
import { useState } from 'react';
import styled from 'styled-components';
import { IoEyeOutline } from 'react-icons/io5';
import { FaRegEyeSlash } from 'react-icons/fa';

type InputType = {
  type?: 'email' | 'password' | '';
  width?: string;
  height?: string;
  value?: string;
  propsPlaceholder?: string;
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: string) => void;
};

const Input = ({ type, value, onChange, propsPlaceholder }: InputType) => {
  const [showPassword, setShowPassword] = useState(false);
  const placeholder =
    type === 'email'
      ? '📧 이메일을 입력해주세요'
      : type === 'password'
        ? '🔑 비밀번호를 입력해주세요'
        : propsPlaceholder;

  function handleShow() {
    setShowPassword(!showPassword);
  }

  return (
    <S.InputContainer type={type}>
      <input
        type={
          type === 'password' ? (showPassword ? 'text' : 'password') : 'email'
        }
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
      />
      {type === 'password' && (
        <S.EyeIconContainer onClick={handleShow}>
          {showPassword ? (
            <FaRegEyeSlash size={20} />
          ) : (
            <IoEyeOutline size={20} />
          )}
        </S.EyeIconContainer>
      )}
    </S.InputContainer>
  );
};

const S = {
  InputContainer: styled.div<InputType>`
    display: flex;
    position: relative;
    width: ${({ width, type }) =>
      width || (type === 'email' || type === 'password' ? '100%' : '10vw')};
    height: ${({ height, type }) =>
      height || (type === 'email' || type === 'password' ? '6vh' : '7vh')};
    input {
      padding-left: 1vw;
      padding-right: 2.5vw;
      width: 100%;
      height: 100%;
      font-size: ${theme.fontSizes.fz18};
      font-weight: ${theme.fontWeights.bold};
      border-radius: ${theme.radius.large};
      border: 0.1px solid ${theme.colors.lightGray1};
      box-shadow: ${theme.boxShadow.subtle};
    }
  `,

  EyeIconContainer: styled.div`
    position: absolute;
    right: 1vw;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2vw;
    height: 2.5vh;
  `,
};

export default Input;
