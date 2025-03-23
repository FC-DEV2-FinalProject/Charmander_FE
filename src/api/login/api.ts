import axios from 'axios';
import useAuthStore from '@/store/store';
import { refreshAccessToken } from './fetchWithAuth';
import Cookies from 'js-cookie';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export const login = async (
  username: string,
  password: string
): Promise<string> => {
  const response = await api.post('/api/v1/auth/login', {
    username,
    password,
  });
  const { accessToken, refreshToken } = response.data;

  api.defaults.headers['Authorization'] = `Bearer ${accessToken}`;

  Cookies.set('refreshToken', refreshToken, {
    expires: 7,
    secure: true,
    httpOnly: true,
  });

  return accessToken;
};

export default api;
