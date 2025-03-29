import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import ProjectCard from './_components/projectCard';
import DropdownSelect from './_components/dropdownSelect';
import EmptyVideoIcon from '@/assets/icons/icon-empty-video.svg?react';
import { getProjects } from '@/api/dashboard/api';
import { sortProjects } from '@/utils/sort';

export const Route = createFileRoute('/_sideBarLayout/my-project/')({
  component: RouteComponent,
});

type TabKey = 'all' | 'editing' | 'cmpltRendering';

export interface IProject {
  // id: number;
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

function RouteComponent() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [selectItems, setSelectItems] = useState<string>('생성일자');
  const [activeTab, setActiveTab] = useState<TabKey>('all');

  const tabMenus = [
    { label: '전체', value: 'all' },
    { label: '편집중', value: 'editing' },
    { label: '렌더링 완료', value: 'cmpltRendering' },
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data.data);
      } catch (err) {
        alert(`${err}`);
      }
    };

    fetchProjects();
  }, []);

  const sortedProjects = useMemo(() => {
    let filteredProjects = projects;

    // 탭에 따른 필터링 추가
    if (activeTab === 'editing') {
      filteredProjects = projects.filter((project) => project.active);
    } else if (activeTab === 'cmpltRendering') {
      filteredProjects = projects.filter((project) => !project.active);
    }

    return sortProjects(filteredProjects, selectItems);
  }, [projects, selectItems, activeTab]);

  return (
    <S.MyProjectWrap>
      {sortedProjects && sortedProjects.length > 0 ? (
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
