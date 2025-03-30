export interface TemplateSize {
  width: number;
  height: number;
}

export interface TemplateImage {
  id: number;
  name: string;
  priority: number;
  type: string;
  fileUrl: string;
  size: TemplateSize;
  createdAt: string;
  updatedAt: string;
}
export interface TemplateData {
  name: string;
  categoryId: number;
  size: TemplateSize;
  background: TemplateImage;
  avatar: TemplateImage;
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
