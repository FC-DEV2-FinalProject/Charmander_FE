import api from '../login/api';

export const fetchProjects = async (projectId: string) => {
  try {
    const response = await api.get(`/api/v1/projects/${projectId}`);
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching projects:', error);
    throw error;
  }
};

export const postProjectTitle = async (projectId: string, title: string) => {
  try {
    const response = await api.post(
      `/api/v1/projects/${projectId}/updateTitle`,
      {
        name: title,
      }
    );

    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('프로젝트 제목 업데이트 실패:', error);
    throw error;
  }
};

export const suggestArticle = async (article: string) => {
  try {
    const response = await api.post('/api/v1/templates/suggest', { article });
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error suggesting article:', error);
    throw error;
  }
};
export const updateArticle = async (projectId: string, article: string) => {
  try {
    const response = await api.post(`/api/v1/article/${projectId}/update`, {
      article,
    });
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error updating article:', error);
    throw error;
  }
};
