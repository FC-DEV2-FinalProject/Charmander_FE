import styled from 'styled-components';
import RightArrowIcon from '@/assets/icons/icon-right-arrow.svg?react';
import { FaUser } from 'react-icons/fa';
import { useDialog } from '@/hook/useDialog';
import { useNavigate } from '@tanstack/react-router';
import React, { RefObject, useEffect, useState } from 'react';
import { getInfo } from '@/api/myPage/api';

interface IUserModalProps {
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  modalRef: RefObject<HTMLDivElement | null>;
}

function SideBarUserModal({ setIsVisible, modalRef }: IUserModalProps) {
  const { alert, confirm } = useDialog();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    getInfo().then((userData) => {
      if (userData) {
        setEmail(userData.email || '');
        setName(userData.name || '');
      }
    });
  }, []);

  // todo 경민: 로그아웃 로직 추가
  const _handleLogout = async () => {
    const isConfirmed = await confirm('로그아웃 하시겠습니까?');
    if (isConfirmed) {
      alert('로그아웃 되었습니다.');
    }
  };

  const _handleLink = (path: string) => {
    navigate({ to: path });
    setIsVisible(false);
  };

  return (
    <S.UserModal ref={modalRef}>
      {/* todo 경민: 링크 수정 */}
      <S.UserInfo onClick={() => _handleLink('/my-page')}>
        <div>
          <p>
            <FaUser
              size="20"
              color="white"
            />
          </p>
          <div>
            <h4>{name}</h4>
            <p>{email}</p>
          </div>
        </div>
        <p>
          <RightArrowIcon />
        </p>
      </S.UserInfo>
      <S.UserMenu>
        <li onClick={() => alert('서비스준비중입니다. ')}>
          구독 설정 <span>Free</span>
        </li>
        <li onClick={() => alert('서비스준비중입니다. ')}>결제 내역</li>
        <li onClick={() => alert('서비스준비중입니다. ')}>워크스페이스 설정</li>
      </S.UserMenu>
      <S.LogoutBtn onClick={_handleLogout}>
        <span>로그아웃</span>
      </S.LogoutBtn>
    </S.UserModal>
  );
}

export default SideBarUserModal;

const S = {
  UserModal: styled.div`
    position: absolute;
    top: 80px;
    padding: 25px;
    padding-bottom: 0;
    background-color: ${({ theme }) => theme.colors.white};
    box-shadow: ${({ theme }) => theme.boxShadow.regular};
    border-radius: ${({ theme }) => theme.radius.large};
    border: 1px solid;
    border-color: ${({ theme }) => theme.colors.lightGray1};
    z-index: 2;
  `,
  UserInfo: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 300px;
    padding-bottom: 20px;
    cursor: pointer;

    > div {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      > p {
        width: 45px;
        height: 45px;
        border-radius: ${({ theme }) => theme.radius.xsmall};
        background-color: ${({ theme }) => theme.colors.primary};
        text-align: center;

        svg {
          margin-top: 12px;
        }
      }
      > div {
        margin-left: 15px;

        h4 {
          font-size: ${({ theme }) => theme.fontSizes.fz20};
          font-weight: ${({ theme }) => theme.fontWeights.medium};
        }
        p {
          font-size: ${({ theme }) => theme.fontSizes.fz14};
        }
      }
    }
  `,

  UserMenu: styled.ul`
    padding: 15px 0;
    border-top: 1px solid;
    border-bottom: 1px solid;
    border-color: ${({ theme }) => theme.colors.lightGray1};

    li {
      padding: 15px 0 15px 10px;
      border-radius: ${({ theme }) => theme.radius.xsmall};
      transition: all 0.3s ease-in-out;
      cursor: pointer;

      span {
        margin-left: 10px;
        font-size: ${({ theme }) => theme.fontSizes.fz12};
        background-color: ${({ theme }) => theme.colors.background};
        padding: 3px 8px;
        border-radius: ${({ theme }) => theme.radius.xsmall};
        border: 1px solid;
        border-color: ${({ theme }) => theme.colors.lightGray1};
      }

      &:hover {
        background-color: ${({ theme }) => theme.colors.background};
      }
    }
  `,

  LogoutBtn: styled.div`
    padding-top: 20px;
    padding-bottom: 20px;
    color: ${({ theme }) => theme.colors.error};
    cursor: pointer;
  `,
};
