import { IProject } from '@/routes/_sideBarLayout/my-project';

export function sortProjects(projects: IProject[], sortBy: string): IProject[] {
  switch (sortBy) {
    case '생성일자':
      return [...projects].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case '이름':
      return [...projects].sort((a, b) => a.name.localeCompare(b.name));
    case '최종수정날짜':
      return [...projects].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    case '마지막 열어본 시간':
      return [...projects].sort(
        (a, b) =>
          new Date(b.lastAccessedAt).getTime() -
          new Date(a.lastAccessedAt).getTime()
      );
    default:
      return projects;
  }
}
