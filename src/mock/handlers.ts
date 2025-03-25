import { http, HttpResponse } from 'msw';
import dummyData from './dummy.json';

export const handlers = [
  http.get('/api/v1/projects/:id', async ({ params }) => {
    const { id } = params;

    const project = dummyData.projects.find((p) => p.id === Number(id));

    //임의로 오류 코드 404 반환하도록 설정했음
    if (!project) {
      return HttpResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(project, { status: 200 });
  }),
];
