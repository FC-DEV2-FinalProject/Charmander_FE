import { FetchTemplateResponse } from '@/types/template';
import api from '../login/api';
import { ImageType, Transcript } from '@/types/projectData';

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

export const patchProjectTitle = async (projectId: string, title: string) => {
  try {
    const response = await api.patch(`/api/v1/projects/${projectId}`, {
      name: title,
    });

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
    console.error('기사 등록 에러:', error);
    throw error;
  }
};

export const patchArticle = async (projectId: string, article: string) => {
  try {
    const response = await api.patch(
      `/api/v1/projects/${projectId}/newsArticle?newsArticle=${article}`
    );
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('기사 업데이트 실패:', error);
  }
};

export const fetchTemplateCategories = async () => {
  try {
    const response = await api.get('/api/v1/templates/categories');
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('카테고리 목록 에러', error);
  }
};
export const fetchTemplate = async () => {
  try {
    const response = await api.get<FetchTemplateResponse>('/api/v1/templates');
    return response.data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('템플릿 페칭 에러', error);
  }
};
export const patchProjectBackgroundImage = async (
  projectId: number | null,
  backgroundImageData: ImageType | null
) => {
  if (projectId) {
    const response = await api.patch(`/api/v1/project/${projectId}`, {
      backgroundImageData,
    });
    return response;
  }
};
export const patchProjectAvatarImage = async (
  projectId: number | null,
  avatarImageData: ImageType | null
) => {
  if (projectId) {
    const response = await api.patch(`/api/v1/project/${projectId}`, {
      avatar: avatarImageData,
    });
    return response;
  }
};
export const postTranscript = async (projectId: number, sceneId: number) => {
  const response = await api.post(
    `/api/v1/projects/${projectId}/scenes/${sceneId}/ts`
  );
  return response.data;
};
export const deleteTranscript = async (
  projectId: number,
  sceneId: number,
  tsId: number
) => {
  const response = await api.delete(
    `/api/v1/projects/${projectId}/scenes/${sceneId}/ts/${tsId}`,
    {
      withCredentials: true,
    }
  );
  return response.data;
};
export const patchTranscript = async (
  projectId: number,
  sceneId: number,
  tsId: number,
  bodyData: Transcript
) => {
  const response = await api.patch(
    `/api/v1/projects/${projectId}/scenes/${sceneId}/ts/${tsId}`,
    {
      text: bodyData.text,
      property: bodyData.property,
    }
  );
  return response.data;
};
