import { routeTree } from '@/routeTree.gen';
import { createRouter } from '@tanstack/react-router';

// 라우터 인스턴스 만들기
export const router = createRouter({
  routeTree,
  notFoundMode: 'fuzzy',
});
