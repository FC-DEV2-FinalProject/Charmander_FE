import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import styled from 'styled-components';
import ProjectCard from './_components/projectCard';
import DropdownSelect from './_components/dropdownSelect';
import EmptyVideoIcon from '@/assets/icons/icon-empty-video.svg?react';
import { getProjects } from '@/api/dashboard/api';
import { sortProjects } from '@/utils/sort';
import { useInfiniteQuery } from 'node_modules/@tanstack/react-query/build/modern';
import LoadingSpinner from '@/components/loading/LoadingSpinner';

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
  const [selectItems, setSelectItems] = useState<string>('생성일자');
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const observerTarget = useRef<HTMLDivElement>(null);

  const tabMenus = [
    { label: '전체', value: 'all' },
    { label: '편집중', value: 'editing' },
    { label: '렌더링 완료', value: 'cmpltRendering' },
  ];

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['projects', activeTab],
    queryFn: ({ pageParam = 0 }) => getProjects(pageParam, 9),
    getNextPageParam: (lastPage, allPages) => {
      const nextOffset = allPages.length * 9;
      return lastPage.hasMore ? nextOffset : undefined;
    },
    initialPageParam: 0,
  });

  useEffect(() => {
    refetch();
  }, [activeTab, refetch]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });
    const currentTarget = observerTarget.current;

    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [handleObserver]);

  const allProjects = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) || [];
  }, [data]);

  const sortedProjects = useMemo(() => {
    let filteredProjects = allProjects;

    if (activeTab === 'editing') {
      filteredProjects = allProjects.filter((project) => project.active);
    } else if (activeTab === 'cmpltRendering') {
      filteredProjects = allProjects.filter((project) => !project.active);
    }

    return sortProjects(filteredProjects, selectItems);
  }, [allProjects, selectItems, activeTab]);

  if (isLoading)
    return <LoadingSpinner text="프로젝트를 불러오는 중입니다..." />;
  if (error) return <div>오류가 발생했습니다: {(error as Error).message}</div>;

  return (
    <S.MyProjectWrap>
      <S.TopSortSect>
        <S.DropDownWrap>
          <DropdownSelect
            placeholder={selectItems}
            options={['생성일자', '이름', '최종수정날짜', '마지막 열어본 시간']}
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

      {isLoading ? (
        <LoadingSpinner text="프로젝트를 불러오는 중입니다..." />
      ) : sortedProjects && sortedProjects.length > 0 ? (
        <>
          <S.MyProjectContent>
            {sortedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                {...project}
              />
            ))}
          </S.MyProjectContent>

          {isFetchingNextPage && <LoadingSpinner showText={false} />}

          {hasNextPage && (
            <div
              ref={observerTarget}
              style={{ height: '20px', margin: '20px 0' }}
            />
          )}
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
