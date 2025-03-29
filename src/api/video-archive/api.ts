import api from '@/api/login/api';
import { getTokens } from '@/utils/Tokens';

export type videoArchiveType = {
  id: number;
  projectId: number;
  jobId: string;
  type: string;
  status: string;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
};

export const getVideoArchive = async () => {
  const { accessToken } = getTokens();
  try {
    const response = await api.get('/api/v1/tasks', {
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
