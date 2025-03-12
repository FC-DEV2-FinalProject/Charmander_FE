import { useState, useRef, useEffect } from 'react';
import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from '@tanstack/react-router';
import styled from 'styled-components';
import Logo from '@/assets/images/logo.svg?react';
import ToggleIcon from '@/assets/icons/icon-up-and-down.svg?react';
import FooterIcon from '@/assets/icons/icon-headphone.svg?react';
import DashboardIcon from '@/components/icons/DashboardIcon';
import MyProjetIcon from '@/components/icons/MyProjectIcon';
import VideoArchiveIcon from '@/components/icons/VideoArchiveIcon';
import PlusIcon from '@/assets/icons/icon-plus.svg?react';
import { FaUser } from 'react-icons/fa';
import { useDialog } from '@/hook/useDialog';
import SideBarUserModal from '@/components/SideBarUserModal';
import media from '@/styles/media';

export const Route = createFileRoute('/_sideBarLayout')({
  component: RouteComponent,
});

const menuItems = [
  { to: '/dashboard', label: '대시보드', icon: DashboardIcon },
  { to: '/my-project', label: '내 프로젝트', icon: MyProjetIcon },
  { to: '/video-archive', label: '영상 보관함', icon: VideoArchiveIcon },
];

function RouteComponent() {
  const location = useLocation();
  const { alert } = useDialog();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement | null>(null);

  const [isVisible, setIsVisible] = useState<boolean>(false);

  const _handleHelpBtn = () => {
    alert('서비스 준비중입니다.');
  };

  const _handleUserModal = () => {
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    function _handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    }

    if (isVisible) {
      document.addEventListener('mousedown', _handleClickOutside);
    } else {
      document.removeEventListener('mousedown', _handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', _handleClickOutside);
    };
  }, [isVisible]);
  return (
    <S.SideBarPageLayout>
      {/* 사이드바 */}
      <S.SideBar>
        <S.SideBarContent>
          <S.Logo>
            <Logo />
          </S.Logo>
          {/* 사용자 정보 */}
          <S.UserInfoWrap>
            <S.UserInfoBox onClick={_handleUserModal}>
              <S.UserInfo>
                <S.UserImage>
                  <FaUser
                    size="20"
                    color="white"
                  />
                </S.UserImage>
                <S.UserNameBox>
                  <S.UserNickname>Avatar</S.UserNickname>
                  <S.UserName>Fast Campus</S.UserName>
                </S.UserNameBox>
              </S.UserInfo>
              <S.ToggleIcon>
                <ToggleIcon />
              </S.ToggleIcon>
            </S.UserInfoBox>
            {isVisible && (
              <SideBarUserModal
                modalRef={ref}
                setIsVisible={setIsVisible}
              />
            )}
          </S.UserInfoWrap>
          {/* todo 경민: 링크 수정 */}
          <S.CreateBtn onClick={() => navigate({ to: `/dashboard` })}>
            <span>
              <PlusIcon />
            </span>
            프로젝트 생성
          </S.CreateBtn>
          {/* 사이드바 메뉴 */}
          <S.SideBarMenu>
            {menuItems.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <S.SideBarMenuItems
                  key={to}
                  isActive={isActive}
                  style={{ backgroundColor: isActive ? '#F6F6FA' : '#fff' }}>
                  <Link to={to}>
                    <Icon active={isActive} />
                    <span>{label}</span>
                  </Link>
                </S.SideBarMenuItems>
              );
            })}
          </S.SideBarMenu>
        </S.SideBarContent>

        {/* 푸터 */}
        <S.Footer>
          <div>
            <FooterIcon />
          </div>
          <h4>무엇을 도와드릴까요?</h4>
          <p>평일 9:00 ~ 18:00</p>
          <button onClick={_handleHelpBtn}>문의하기</button>
        </S.Footer>
      </S.SideBar>

      {/* 메인 컨텐츠 */}
      <S.Content>
        <Outlet />
      </S.Content>
    </S.SideBarPageLayout>
  );
}

const S = {
  SideBarPageLayout: styled.div`
    display: grid;
    grid-template-columns: 320px 1fr;
    height: 100vh;
  `,

  SideBar: styled.nav`
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  `,
  SideBarContent: styled.div`
    margin-top: 15px;
    ${media.medium`
    margin-top:0px; 
    `}
  `,

  Logo: styled.div`
    text-align: center;
  `,
  UserInfoWrap: styled.div`
    position: relative;
  `,

  UserInfoBox: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding: 13px;
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: ${({ theme }) => theme.radius.large};
    border: 1px solid;
    border-color: ${({ theme }) => theme.colors.lightGray1};
    box-shadow: ${({ theme }) => theme.boxShadow.subtle};
    cursor: pointer;
  `,
  UserInfo: styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
  `,
  UserImage: styled.div`
    width: 45px;
    height: 45px;
    border-radius: ${({ theme }) => theme.radius.xsmall};
    background-color: ${({ theme }) => theme.colors.primary};
    text-align: center;

    svg {
      margin-top: 12px;
    }
  `,
  UserNameBox: styled.div`
    margin-left: 15px;
  `,
  UserNickname: styled.h3`
    font-size: ${({ theme }) => theme.fontSizes.fz20};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
  `,
  UserName: styled.p`
    font-size: ${({ theme }) => theme.fontSizes.fz14};
  `,

  ToggleIcon: styled.div`
    padding-top: 5px;
  `,

  CreateBtn: styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 15px 0;
    margin-top: 20px;
    border-radius: ${({ theme }) => theme.radius.small};
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    font-weight: ${({ theme }) => theme.fontWeights.medium};

    span {
      margin-right: 10px;
    }
  `,

  SideBarMenu: styled.ul`
    margin-top: 40px;
  `,

  SideBarMenuItems: styled.li<{ isActive?: boolean }>`
    margin-bottom: 10px;
    border-radius: ${({ theme }) => theme.radius.large};
    background-color: ${({ theme, isActive }) =>
      isActive ? theme.colors.background1 : theme.colors.white};
    color: ${({ theme, isActive }) =>
      isActive ? theme.colors.text : theme.colors.darkGray2};
    font-weight: ${({ theme, isActive }) =>
      isActive ? theme.fontWeights.medium : theme.fontWeights.regular};
    cursor: pointer;
    transition: all 0.3s ease-in-out;

    a {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 20px;

      span {
        margin-left: 20px;
      }
    }

    &:hover {
      background-color: ${({ theme }) => theme.colors.background} !important;
    }
  `,

  Footer: styled.div`
    margin-bottom: 40px;
    padding: 30px 17px;
    background-color: ${({ theme }) => theme.colors.background};
    border-radius: ${({ theme }) => theme.radius.xlarge};

    ${media.medium`
    margin-bottom: 20px;
    `}

    h4 {
      margin-top: 12px;
      font-size: ${({ theme }) => theme.fontSizes.fz15};
      font-weight: ${({ theme }) => theme.fontWeights.medium};
    }
    p {
      margin-top: 5px;
      font-size: ${({ theme }) => theme.fontSizes.fz12};
      color: ${({ theme }) => theme.colors.darkGray4};
    }
    button {
      width: 100%;
      margin-top: 20px;
      padding: 16px 0;
      border: 1px solid;
      border-radius: ${({ theme }) => theme.radius.large};
      border-color: ${({ theme }) => theme.colors.lightGray2};
      text-align: cetner;
      color: ${({ theme }) => theme.colors.darkGray4};
      font-weight: ${({ theme }) => theme.fontWeights.medium};
    }
  `,

  Content: styled.main`
    background-color: #f7f8fa;
    padding: 20px;
    overflow: auto;
  `,
};
