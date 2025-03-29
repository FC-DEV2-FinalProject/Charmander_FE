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

export const deleteProject = async (projectId: number) => {
  const { accessToken } = getTokens();

  try {
    const response = await api.delete(`/api/v1/projects/${projectId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // 204 No Content는 성공적인 삭제를 의미
    if (response.status === 204) {
      return {
        success: true,
        message: '프로젝트가 성공적으로 삭제되었습니다.',
      };
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
    return {
      success: false,
      message: '알 수 없는 오류가 발생했습니다.',
    };
  }
};
