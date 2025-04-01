import { createFileRoute, Link } from '@tanstack/react-router';
import styled from 'styled-components';
import MoreIcon from '@/assets/icons/icon-more.svg?react';
import AvatarIcon from '@/assets/icons/icon-default-avatar.svg?react';
import ScreenRatioIcon from '@/assets/icons/icon-screen-ratio.svg?react';
import { useState, useRef, useEffect } from 'react';
import { useDialog } from '@/hook/useDialog';
import { deleteProject } from '@/api/dashboard/api';

export const Route = createFileRoute(
  '/_sideBarLayout/my-project/_components/projectCard'
)({
  component: ProjectCard,
});

interface ProjectProps {
  // title: string;
  // updatedAt: string;
  // isLoaded: boolean;
  // progress: number;
  id: number;
  name: string;
  active: boolean;
  version: number;
  lastAccessedAt: string;
  createdAt: string;
  updatedAt: string;
}

function ProjectCard(project: ProjectProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { alert, confirm } = useDialog();
  const ref = useRef<HTMLUListElement>(null);

  const _handleCopyBtn = () => {
    alert('복사본이 생성되었습니다.');

    setIsOpen(false);
  };
  const _handleDeleteBtn = async (projectId: number) => {
    const isConfirmed = await confirm(
      '프로젝트를 삭제하시겠습니까?',
      '삭제된 영상은 복구할 수 없습니다.'
    );
    if (isConfirmed) {
      const result = await deleteProject(projectId);
      if (result) alert(result.message);
    }

    setIsOpen(false);
  };
  useEffect(() => {
    const _handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener('click', _handleClickOutside, true);
    }

    return () => window.removeEventListener('click', _handleClickOutside, true);
  }, [isOpen]);

  return (
    <div
      style={{
        position: 'relative',
      }}>
      <S.CardWrap>
        <S.CardTopInfo>
          <div>
            <AvatarIcon />
          </div>
          <p onClick={() => setIsOpen(!isOpen)}>
            <MoreIcon color="#92929D" />
          </p>
        </S.CardTopInfo>
        <Link to={`/${project.id}/article`}>
          <S.ProjectTitle>
            <h3 className="title">{project.name}</h3>
            <div>
              <p className="description">
                이것은 대본 요약본입니다. 최대 두줄까지 작성이
                가능하고....이것은 대본 요약본입니다. 최대 두줄까지 작성이
                가능하고....이것은 대본 요약본입니다. 최대 두줄까지 작성이
                가능하고....이것은 대본 요약본입니다. 최대 두줄까지 작성이
                가능하고....
              </p>
            </div>
          </S.ProjectTitle>
          <S.ProjectInfo>
            <p className="icon">
              <ScreenRatioIcon />
            </p>
            <div className="editdate-wrap">
              <h4 className="editdate">{project.lastAccessedAt}</h4>
            </div>
          </S.ProjectInfo>
        </Link>
      </S.CardWrap>
      {isOpen && (
        <S.ModalMenu ref={ref}>
          <S.ModalItem onClick={_handleCopyBtn}>복제하기</S.ModalItem>
          <S.ModalItem onClick={() => _handleDeleteBtn(project.id)}>
            삭제하기
          </S.ModalItem>
        </S.ModalMenu>
      )}
    </div>
  );
}

export default ProjectCard;

const S = {
  CardWrap: styled.div`
    position: relative;
    // width: 465px;
    padding: 20px;
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: ${({ theme }) => theme.radius.xlarge};
    transition: all 0.3s ease-in-out;
    cursor: pointer;

    &:hover {
      background-color: ${({ theme }) => theme.colors.primary};
      box-shadow: ${({ theme }) => theme.boxShadow.regular};

      .title {
        color: ${({ theme }) => theme.colors.white};
      }
      .description {
        color: ${({ theme }) => theme.colors.white};
        opacity: 0.8;
      }
      .editdate-wrap {
        background-color: #1a3e78;
      }
      .editdate {
        color: ${({ theme }) => theme.colors.white};
        opacity: 1;
      }
      .icon {
        svg {
          color: ${({ theme }) => theme.colors.white};
        }
      }
    }
  `,

  CardTopInfo: styled.div`
    display: flex;
    align-items: start;
    justify-content: space-between;

    p {
      cursor: pointer;
      z-index: 2;

      svg {
        transition: all 0.3s ease-in-out;
      }

      &:hover {
        svg {
          color: white;
        }
      }
    }
  `,

  ProjectTitle: styled.div`
    margin-top: 12px;
    h3 {
      font-size: ${({ theme }) => theme.fontSizes.fz20};
      font-weight: ${({ theme }) => theme.fontWeights.medium};
      margin-bottom: 10px;
      transition: all 0.3s ease-in-out;
    }

    div {
      width: 80%;
      min-height: 40px;

      p {
        font-size: ${({ theme }) => theme.fontSizes.fz14};
        color: ${({ theme }) => theme.colors.textSecond};
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-word;
      }
    }
  `,
  ProjectInfo: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 35px;

    div {
      padding: 4px 10px;
      background-color: ${({ theme }) => theme.colors.background2};
      border-radius: ${({ theme }) => theme.radius.xsmall};
      transition: all 0.3s ease-in-out;

      h4 {
        font-size: ${({ theme }) => theme.fontSizes.fz14};
        color: ${({ theme }) => theme.colors.textSecond};
        transition: all 0.3s ease-in-out;
      }
    }
  `,
  ModalMenu: styled.ul`
    position: absolute;
    right: -80px;
    top: 50px;
    width: 130px;
    text-align: center;
    box-shadow: ${({ theme }) => theme.boxShadow.regular};
    border-radius: ${({ theme }) => theme.radius.xsmall};
    background-color: ${({ theme }) => theme.colors.white};
    z-index: 3;
    overflow: hidden;
  `,

  ModalItem: styled.li`
    padding: 14px 10px;
    font-size: ${({ theme }) => theme.fontSizes.fz14};
    cursor: pointer;
    transition: all 0.3s ease-in-out;

    &:first-child {
      border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray1};
    }
    &:hover {
      font-weight: ${({ theme }) => theme.fontWeights.medium};
      background-color: ${({ theme }) => theme.colors.background1};
    }
  `,
};
