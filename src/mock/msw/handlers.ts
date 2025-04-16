import { http, HttpResponse } from 'msw';
import projectDummy from '../mockData/projectDummy.json';
import suggestArticleDummyData from '../mockData/suggestArticleDummyData.json';
import categoryData from '../mockData/categoryData.json';
import templateImageData from '../mockData/templateImage.json';

export const handlers = [
  http.get(
    `${import.meta.env.VITE_API_URL}/api/v1/projects/:id`,
    async ({ params }) => {
      const { id } = params;
      const project = projectDummy;
      //임의로 오류 코드 404 반환하도록 설정했음
      if (project.id !== id) {
        return HttpResponse.json(
          { message: 'Project not found' },
          { status: 404 }
        );
      }
      return HttpResponse.json(project, { status: 200 });
    }
  ),
  http.post(
    `${import.meta.env.VITE_API_URL}/api/v1/projects/:id/updateTitle`,
    async ({ params, request }) => {
      const { id } = params;
      const { name } = (await request.json()) as { name: string };
      if (!name) {
        return HttpResponse.json(
          { message: 'article not found' },
          { status: 404 }
        );
      }
      return HttpResponse.json(
        {
          success: true,
          message: `프로젝트 ${id}의 제목이 성공적으로 업데이트되었습니다.`,
          updatedName: name,
        },
        { status: 200 }
      );
    }
  ),
  http.post(
    `${import.meta.env.VITE_API_URL}/api/v1/templates/suggest`,
    async (article) => {
      if (!article) {
        return HttpResponse.json(
          { message: 'article not found' },
          { status: 404 }
        );
      }
      return HttpResponse.json(suggestArticleDummyData, { status: 200 });
    }
  ),
  http.post(
    `${import.meta.env.VITE_API_URL}/api/v1/article/:id/update`,
    async ({ params, request }) => {
      const { id } = params;
      const { article } = (await request.json()) as { article: string };
      if (!article) {
        return HttpResponse.json(
          { message: 'article not found' },
          { status: 404 }
        );
      }
      return HttpResponse.json(
        {
          success: true,
          message: `프로젝트 ${id}의 기사가가 성공적으로 업데이트되었습니다.`,
          updatedArticle: name,
        },
        { status: 200 }
      );
    }
  ),
  http.get(
    `${import.meta.env.VITE_API_URL}/api/v1/templates/categories`,
    async () => {
      return HttpResponse.json(categoryData, { status: 200 });
    }
  ),
  http.get(`${import.meta.env.VITE_API_URL}/api/v1/templates`, async () => {
    return HttpResponse.json(templateImageData, { status: 200 });
  }),
];
