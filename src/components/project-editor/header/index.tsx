import styled from 'styled-components';
import React, { useState } from 'react';
import theme from '@/styles/theme';
import { HiChevronLeft } from 'react-icons/hi';
import { FiEdit } from 'node_modules/react-icons/fi';
import { Link, useLocation } from '@tanstack/react-router';

const ProjectHeader = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [projectTitle, setProjectTitle] = useState('새 프로젝트');
  const onChangeProjectTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectTitle(e.target.value);
  };
  const location = useLocation();
  return (
    <>
      <S.HeaderContainer>
        <S.HeaderLeftContents>
          <Link to={'/dashboard'}>
            <HiChevronLeft size={50} />
          </Link>
          <S.TitleBox>
            {isEdit ? (
              <S.ProjectTitle
                value={projectTitle}
                onChange={onChangeProjectTitle}
              />
            ) : (
              <S.ViewText onClick={() => setIsEdit(true)}>
                {projectTitle}
              </S.ViewText>
            )}
            <FiEdit
              color="white"
              onClick={() => setIsEdit(!isEdit)}
              size={30}
            />
          </S.TitleBox>
        </S.HeaderLeftContents>
        <S.ButtonBox>
          {location.pathname.endsWith('/article') ? (
            <>
              <S.HeaderButton>기사 파일 업로드</S.HeaderButton>
              <S.HeaderButton>템플릿 추천</S.HeaderButton>
              <Link
                to="/$project/avatar"
                params={{ project: '1' }}>
                <S.HeaderButton>템플릿 없이 진행하기</S.HeaderButton>
              </Link>
            </>
          ) : (
            <S.HeaderButton>제작하기</S.HeaderButton>
          )}
        </S.ButtonBox>
      </S.HeaderContainer>
    </>
  );
};

export default ProjectHeader;

const S = {
  HeaderContainer: styled.div`
    width: 100%;
    height: 60px;
    background-color: ${theme.colors.primary};
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: white;
    svg {
      cursor: pointer;
      margin-left: ${theme.spacing.sm};
    }
  `,
  HeaderLeftContents: styled.div`
    display: flex;
    align-items: center;
  `,
  TitleBox: styled.div`
    width: 100%;
    margin-left: 270px;
    display: flex;
    align-items: center;
  `,

  ProjectTitle: styled.input`
    width: 100%;
    background-color: theme.colors.white;
    border: none;
    outline: none;
    color: theme.colors.black;
    font-size: ${theme.fontSizes.fz30};
  `,
  ViewText: styled.span`
    font-size: ${theme.fontSizes.fz30};
  `,
  ButtonBox: styled.div`
    display: flex;
    align-items: center;
  `,

  HeaderButton: styled.button`
    background-color: ${theme.colors.white};
    margin-right: ${theme.spacing.md};
    border-radius: ${theme.radius.small};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    color: ${theme.colors.primary};
    font-weight: ${theme.fontWeights.bold};
  `,
};
