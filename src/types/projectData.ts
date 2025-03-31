/* eslint-disable no-unused-vars */
import { TemplateImage, TemplateSize } from './template';

export interface Position {
  x: number;
  y: number;
}
export interface ImageType {
  id: number;
  name: string;
  priority: number;
  type: string;
  fileUrl: string;
  position: Position;
  scale: number;
  viewport: number[];
  size: TemplateSize;
  createdAt: string;
  updatedAt: string;
}

export interface Subtitle {
  text: string;
  fontFamily: string;
  fontSize: number;
  fontColor: string;
  backgroundColor: string;
  position: Position;
}
export interface Transcript {
  id: number;
  sceneId: number;
  text: string;
  property: {
    speed: number;
    postDelay: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Scene {
  id: number;
  transcripts: Transcript[];
  subtitle: Subtitle;
  media: ImageType | null;
  avatar: ImageType | null;
}

export interface Project {
  id: number;
  name: string;
  scenes: Scene[];
}

export interface ProjectState {
  projectData: Project | null;
  setProjectData: (project: Project) => void;
  resetProjectData: () => void;
  updateMedia: (template: TemplateImage) => void;
  updateAvatar: (template: TemplateImage) => void;
  updateElementPosition: (isAvatar: boolean, newPosition: Position) => void;
  updateElementSize: (isAvatar: boolean, newSize: TemplateSize) => void;
  resetMedia: () => void;
  updateTranscripts: (
    sceneId: number,
    transcriptId: number,
    newData: Partial<Scene['transcripts'][0]>
  ) => void;
  updateSubtitle: (sceneId: number, newSubtitle: Partial<Subtitle>) => void;
}
