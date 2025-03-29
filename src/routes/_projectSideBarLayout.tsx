import {
  createFileRoute,
  Link,
  Outlet,
  useMatchRoute,
} from '@tanstack/react-router';
import styled from 'styled-components';
import ArticleWhite from '@/assets/projectIcon/article-white.svg?react';
import TemplateWhite from '@/assets/projectIcon/template-white.svg?react';
import AvatarWhite from '@/assets/projectIcon/emoji-happy-white.svg?react';
import GalleryWhite from '@/assets/projectIcon/background-white.svg?react';
import ScriptWhite from '@/assets/projectIcon/script-white.svg?react';
import Article from '@/assets/projectIcon/article.svg?react';
import Template from '@/assets/projectIcon/template.svg?react';
import Avatar from '@/assets/projectIcon/emoji-happy.svg?react';
import Gallery from '@/assets/projectIcon/background.svg?react';
import Script from '@/assets/projectIcon/script.svg?react';
import theme from '@/styles/theme';
import ProjectHeader from '@/components/project-editor/header';

export const Route = createFileRoute('/_projectSideBarLayout')({
  component: RouteComponent,
});

function RouteComponent() {
  const { project } = Route.useParams();
  const matchRoute = useMatchRoute();
  return (
    <>
      <ProjectHeader />
      <S.ProjectLayout>
        <S.ProjectSideBar>
          <S.IconBox $active={!!matchRoute({ to: '/$project/article' })}>
            <Link
              to="/$project/article"
              params={{ project: project }}>
              {matchRoute({ to: '/$project/article' }) ? (
                <Article
                  width={80}
                  height={60}
                />
              ) : (
                <ArticleWhite
                  width={80}
                  height={60}
                />
              )}

              <p>기사 입력</p>
            </Link>
          </S.IconBox>
          <S.IconBox $active={!!matchRoute({ to: '/$project/template' })}>
            <Link
              to="/$project/template"
              params={{ project: project }}>
              {matchRoute({ to: '/$project/template' }) ? (
                <Template
                  width={80}
                  height={60}
                />
              ) : (
                <TemplateWhite
                  width={80}
                  height={60}
                />
              )}

              <p>템플릿 선택</p>
            </Link>
          </S.IconBox>
          <S.IconBox $active={!!matchRoute({ to: '/$project/background' })}>
            <Link
              to="/$project/background"
              params={{ project: project }}>
              {matchRoute({ to: '/$project/background' }) ? (
                <Gallery
                  width={80}
                  height={60}
                />
              ) : (
                <GalleryWhite
                  width={80}
                  height={60}
                />
              )}

              <p>배경 선택</p>
            </Link>
          </S.IconBox>
          <S.IconBox $active={!!matchRoute({ to: '/$project/avatar' })}>
            <Link
              to="/$project/avatar"
              params={{ project: project }}>
              {matchRoute({ to: '/$project/avatar' }) ? (
                <Avatar
                  width={80}
                  height={60}
                />
              ) : (
                <AvatarWhite
                  width={80}
                  height={60}
                />
              )}
              <p>아바타 선택</p>
            </Link>
          </S.IconBox>
          <S.IconBox $active={!!matchRoute({ to: '/$project/script' })}>
            <Link
              to="/$project/script"
              params={{ project: project }}>
              {matchRoute({ to: '/$project/script' }) ? (
                <Script
                  width={80}
                  height={60}
                />
              ) : (
                <ScriptWhite
                  width={80}
                  height={60}
                />
              )}

              <p>대사/자막</p>
            </Link>
          </S.IconBox>
        </S.ProjectSideBar>
        <Content>
          <Outlet />
        </Content>
      </S.ProjectLayout>
    </>
  );
}

const S = {
  ProjectLayout: styled.div`
    display: grid;
    grid-template-columns: 175px 1fr;
    height: calc(100vh - 80px);
  `,
  ProjectSideBar: styled.div`
    padding: ${theme.spacing.lg};
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${theme.spacing.lg};
    border-right: 1px solid ${theme.colors.border1};
  `,
  IconBox: styled.div<{ $active: boolean }>`
    padding: ${theme.spacing.md};
    border-radius: ${theme.radius.small};
    background-color: ${({ $active }) =>
      $active ? theme.colors.background2 : ''};
    font-size: ${theme.fontSizes.fz20};
    p {
      ${({ $active }) =>
        $active
          ? `color: ${theme.colors.primary}; font-weight:${theme.fontWeights.bold};`
          : `color: ${theme.colors.textSecond}; font-weight:${theme.fontWeights.medium};`}
    }
  `,
};
const Content = styled.main`
  background-color: ${theme.colors.background};
  padding: 50px;
  overflow: auto;
`;
