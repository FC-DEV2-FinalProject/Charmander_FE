import api from '@/api/login/api';
import { getTokens } from '@/utils/Tokens';

export const getInfo = async () => {
  const accessToken = getTokens();

  const response = await api.get('/api/v1/members/my', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};
