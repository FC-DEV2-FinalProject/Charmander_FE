export interface TemplateSize {
  width: number;
  height: number;
}

export interface TemplateBackground {
  id: number;
  name: string;
  priority: number;
  type: string;
  fileUrl: string;
  size: TemplateSize;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateAvatar {
  id: number;
  name: string;
  priority: number;
  fileUrl: string;
  size: TemplateSize;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateData {
  name: string;
  categoryId: number;
  size: TemplateSize;
  background: TemplateBackground;
  avatar: TemplateAvatar;
}

export interface Template {
  id: number;
  priority: number;
  thumbnailUrl: string;
  data: TemplateData;
  createdAt: string;
  updatedAt: string;
}

export interface FetchTemplateResponse {
  data: Template[];
}
