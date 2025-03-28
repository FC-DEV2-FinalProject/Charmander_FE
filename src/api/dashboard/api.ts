import api from '@/api/login/api';
import { getTokens } from '@/utils/Tokens';

export type ProjectResponseType = {
  id: string;
};
export const getProjects = async () => {
  const { accessToken } = getTokens();

  try {
    const response = await api.get('/api/v1/projects', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

export const postProject = async () => {
  const { accessToken } = getTokens();

  try {
    const response = await api.post('/api/v1/projects', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};
