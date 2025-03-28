import { http, HttpResponse } from 'msw';
import projectDummy from './dashboardDummy.json';

export const dashboardHandlers = [
  http.get(`${import.meta.env.VITE_API_URL}/api/v1/projects`, async () => {
    const projects = projectDummy.data;

    //임의로 오류 코드 404 반환하도록 설정했음
    if (!projects) {
      return HttpResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(projects, { status: 200 });
  }),

  http.post(`${import.meta.env.VITE_API_URL}/api/v1/projects`, async () => {
    const newProject = {
      id: 1,
      name: '',
      active: false,
      data: '',
      version: 1073741824,
      lastAccessedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json(newProject, { status: 201 });
  }),
];
