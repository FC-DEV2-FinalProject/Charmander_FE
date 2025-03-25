import axios from 'axios';

const API_BASE_URL = '/'; // 실제 API 주소로 변경

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchProjects = async (projectId: string) => {
  try {
    const response = await api.get(`/api/v1/projects/${projectId}`);
    return response.data;
  } catch (error) {
    alert(`Error fetching projects:, ${error}`);
    throw error;
  }
};
