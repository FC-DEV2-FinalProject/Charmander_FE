import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import ProjectCard from './_components/projectCard';
import DropdownSelect from './_components/dropdownSelect';
import axios from 'axios';
import EmptyVideoIcon from '@/assets/icons/icon-empty-video.svg?react';

export const Route = createFileRoute('/_sideBarLayout/my-project/')({
  component: RouteComponent,
});

type TabKey = 'all' | 'editing' | 'cmpltRendering';

interface IProject {
  id: number;
  title: string;
  updatedAt: string;
  isLoaded: boolean;
  progress: number;
}

function RouteComponent() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [selectItems, setSelectItems] = useState<string>('생성일자');
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const PROJECT_DUMMY = '/src/mock/dummy.json';

  const tabMenus = [
    { label: '전체', value: 'all' },
    { label: '편집중', value: 'editing' },
    { label: '렌더링 완료', value: 'cmpltRendering' },
  ];

  useEffect(() => {
    const _getProjects = async () => {
      try {
        const res = await axios.get(PROJECT_DUMMY);
        setProjects(res.data.projects);
      } catch (err) {
        alert(`${err}`);
      }
    };

    _getProjects();
  }, []);

  return (
    <S.MyProjectWrap>
      {projects.length > 0 ? (
        <>
          <S.TopSortSect>
            <S.DropDownWrap>
              <DropdownSelect
                placeholder={selectItems}
                options={[
                  '생성일자',
                  '이름',
                  '최종수정날짜',
                  '마지막 열어본 시간',
                ]}
                onSelect={(value) => setSelectItems(value)}
              />
            </S.DropDownWrap>
            <S.TapWrap>
              {tabMenus.map((menu) => (
                <S.TapItem
                  key={menu.value}
                  $isActive={activeTab === menu.value}
                  onClick={() => setActiveTab(menu.value as TabKey)}>
                  {menu.label}
                </S.TapItem>
              ))}
            </S.TapWrap>
          </S.TopSortSect>
          <S.MyProjectContent>
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                {...project}
              />
            ))}
          </S.MyProjectContent>
        </>
      ) : (
        <S.NoneContent>
          <EmptyVideoIcon />
          <span>제작된 영상이 없습니다.</span>
        </S.NoneContent>
      )}
    </S.MyProjectWrap>
  );
}

const S = {
  MyProjectWrap: styled.div`
    padding: 50px;
    height: calc(100% - 74px);
  `,
  TopSortSect: styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
  `,
  DropDownWrap: styled.div`
    width: 160px;
  `,
  TapWrap: styled.ul`
    display: flex;
    width: fit-content;
    border: 1px solid ${({ theme }) => theme.colors.lightGray2};
    border-radius: ${({ theme }) => theme.radius.xsmall};
    overflow: hidden;
  `,
  TapItem: styled.li<{ $isActive: boolean }>`
    text-align: center;
    width: 100px;
    height: 45px;
    border-right: 1px solid ${({ theme }) => theme.colors.lightGray2};
    font-size: ${({ theme }) => theme.fontSizes.fz14};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    line-height: 45px;
    cursor: pointer;
    background: ${({ $isActive, theme }) =>
      $isActive ? theme.colors.primary : theme.colors.white};
    color: ${({ $isActive, theme }) =>
      $isActive ? theme.colors.white : theme.colors.text};

    &:last-child {
      border-right: none;
    }
  `,

  MyProjectContent: styled.div`
    margin-top: 50px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(365px, 465px));
    gap: 30px;
  `,

  NoneContent: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: ${({ theme }) => theme.radius.small};

    span {
      margin-top: 20px;
      font-size: ${({ theme }) => theme.fontSizes.fz18};
      font-weight: ${({ theme }) => theme.fontWeights.medium};
      color: ${({ theme }) => theme.colors.primary};
    }
  `,
};
