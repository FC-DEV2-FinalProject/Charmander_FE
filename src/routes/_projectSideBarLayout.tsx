import {
  createFileRoute,
  Link,
  Outlet,
  useMatchRoute,
} from '@tanstack/react-router';
import styled from 'styled-components';
import Article from '@/assets/projectIcon/article.svg?react';
import ChooseTemplate from '@/assets/projectIcon/chooseTemplate.svg?react';
import Avatar from '@/assets/projectIcon/avatar.svg?react';
import Gallery from '@/assets/projectIcon/gallery.svg?react';
import Script from '@/assets/projectIcon/script.svg?react';
import theme from '@/styles/theme';

export const Route = createFileRoute('/_projectSideBarLayout')({
  component: RouteComponent,
});

function RouteComponent() {
  const id = '1';
  const matchRoute = useMatchRoute();
  return (
    <S.ProjectLayout>
      <S.ProjectSideBar>
        <S.IconBox active={!!matchRoute({ to: '/$project/article' })}>
          <Link
            to="/$project/article"
            params={{ project: id }}>
            <Article
              width={80}
              height={60}
            />
            <p>기사 입력</p>
          </Link>
        </S.IconBox>
        <S.IconBox active={!!matchRoute({ to: '/$project/template' })}>
          <Link
            to="/$project/template"
            params={{ project: id }}>
            <ChooseTemplate
              width={80}
              height={60}
            />
            <p>템플릿 선택</p>
          </Link>
        </S.IconBox>
        <S.IconBox active={!!matchRoute({ to: '/$project/avatar' })}>
          <Link
            to="/$project/avatar"
            params={{ project: id }}>
            <Avatar
              width={80}
              height={60}
            />
            <p>아바타 선택</p>
          </Link>
        </S.IconBox>
        <S.IconBox active={!!matchRoute({ to: '/$project/background' })}>
          <Link
            to="/$project/background"
            params={{ project: id }}>
            <Gallery
              width={80}
              height={60}
            />
            <p>배경 선택</p>
          </Link>
        </S.IconBox>
        <S.IconBox active={!!matchRoute({ to: '/$project/script' })}>
          <Link
            to="/$project/script"
            params={{ project: id }}>
            <Script
              width={80}
              height={60}
            />
            <p>대사/자막</p>
          </Link>
        </S.IconBox>
      </S.ProjectSideBar>
      <Content>
        <Outlet />
      </Content>
    </S.ProjectLayout>
  );
}

const S = {
  ProjectLayout: styled.div`
    display: grid;
    grid-template-columns: 320px 1fr;
    height: 100vh;
  `,
  ProjectSideBar: styled.div`
    padding: ${theme.spacing.lg};
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${theme.spacing.lg};
  `,
  IconBox: styled.div<{ active: boolean }>`
    padding: ${theme.spacing.md};
    border-radius: ${theme.radius.small};
    background-color: ${({ active }) =>
      active ? theme.colors.background2 : ''};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: ${theme.fontSizes.fz18};
    gap: ${theme.spacing.sm};
  `,
};
const Content = styled.main`
  background-color: ${theme.colors.background};
  padding: ${theme.spacing.lg};
  overflow: auto;
`;
