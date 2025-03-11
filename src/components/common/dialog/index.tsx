import React, { useEffect, useRef } from 'react';
import useDialogStore from '@/store/useDialogStore';
import styled from 'styled-components';

const Dialog = () => {
  const { isOpen, messages, onConfirm, onCancel, isConfirm } = useDialogStore();

  const ref = useRef<HTMLDivElement>(null);

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const key = e.key;
    if (key === 'Enter') {
      e.preventDefault();
      onConfirm();
    }
    if (isConfirm && key === 'Escape') {
      handleCancel();
    }
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, [isOpen, isConfirm]);

  if (!isOpen) return null;

  return (
    <S.DialogBackDrop
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      ref={ref}>
      <S.DialogContainer>
        {messages.map((message, i) => (
          <S.DialogDesc key={i}>{message}</S.DialogDesc>
        ))}

        <S.DialogBtnWrap>
          {isConfirm && <S.DialogBtn onClick={handleCancel}>취소</S.DialogBtn>}
          <S.DialogBtn
            $btnType={'confirm'}
            onClick={handleConfirm}>
            확인
          </S.DialogBtn>
        </S.DialogBtnWrap>
      </S.DialogContainer>
    </S.DialogBackDrop>
  );
};

export default Dialog;

const S = {
  DialogBackDrop: styled.div`
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
  `,

  DialogContainer: styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-width: 300px;
    max-width: 400px;
    padding: 35px 20px 20px;
    background: ${({ theme }) => theme.colors.white};
    border-radius: ${({ theme }) => theme.radius.medium};
  `,

  DialogDesc: styled.p`
    text-align: center;
  `,

  DialogBtnWrap: styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
  `,

  DialogBtn: styled.button<{ $btnType?: string }>`
    flex-grow: 1;
    padding: 8px 0;

    background: ${({ $btnType, theme }) =>
      $btnType === 'confirm' ? theme.colors.primary : theme.colors.lightGray1};
    border-radius: ${({ theme }) => theme.radius.xsmall};
    color: ${({ $btnType, theme }) =>
      $btnType === 'confirm' ? theme.colors.white : theme.colors.text};
    text-align: center;
    transition: all 0.3s ease-in-out;

    &:hover {
      opacity: 0.7;
    }
  `,
};
