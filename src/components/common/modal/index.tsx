import theme from '@/styles/theme';
import { ReactNode, useRef, useState } from 'react';
import styled from 'styled-components';
import CloseIcon from '@/assets/projectIcon/icon_size.svg?react';

const Modal = ({
  children,
  openText,
}: {
  // eslint-disable-next-line no-unused-vars
  children: ReactNode | ((setModalOpen: (open: boolean) => void) => ReactNode);
  openText: string;
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const modalBackground = useRef<HTMLDivElement>(null);

  return (
    <>
      <S.ModalOpenBtn onClick={() => setModalOpen(true)}>
        {openText}
      </S.ModalOpenBtn>

      {modalOpen && (
        <S.ModalContainer
          ref={modalBackground}
          onClick={(e) => {
            if (e.target === modalBackground.current) {
              setModalOpen(false);
            }
          }}>
          <S.ModalContent>
            <S.BtnWrapper>
              <S.ModalCloseBtn onClick={() => setModalOpen(false)}>
                <CloseIcon />
              </S.ModalCloseBtn>
            </S.BtnWrapper>
            {typeof children === 'function'
              ? children(() => setModalOpen(false))
              : children}
          </S.ModalContent>
        </S.ModalContainer>
      )}
    </>
  );
};

export default Modal;

const S = {
  BtnWrapper: styled.div`
    display: flex;
    justify-content: flex-end;
  `,
  ModalCloseBtn: styled.div`
    cursor: pointer;
  `,
  ModalOpenBtn: styled.button`
    background-color: ${theme.colors.primary};
    margin-right: ${theme.spacing.md};
    border-radius: ${theme.radius.small};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    color: ${theme.colors.white};
    font-weight: ${theme.fontWeights.bold};
    cursor: pointer;
  `,
  ModalContainer: styled.div`
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    align-items: center;
    z-index: 100;
  `,
  ModalContent: styled.div`
    background-color: ${theme.colors.white};
    max-width: 70%;
    max-height: 70%;
    align-content: center;
    padding: ${theme.spacing.xl};
    border-radius: ${theme.radius.medium};
  `,
};
