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
