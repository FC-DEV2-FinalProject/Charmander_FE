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
  fileId: string;
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
  background: ImageType | null;
  avatar: ImageType | null;
}

export interface Project {
  id: number;
  name: string;
  scenes: Scene[];
}

export type SuggestProjectData = {
  avatar: ImageType | null;
  background: ImageType | null;
  categoryId: number;
  name: string;
  size: TemplateSize;
  id: number;
  priority: number;
  thumbnailUrl: string;
  updatedAt: string;
};

export interface ProjectState {
  projectData: Project | null;
  setProjectData: (project: Project) => void;
  resetProjectData: () => void;
  setSuggestProjectData: (newData: SuggestProjectData) => void;
  updateBackground: (template: TemplateImage) => void;
  updateAvatar: (template: TemplateImage) => void;
  updateElementPosition: (
    elementId: number,
    isAvatar: boolean,
    newPosition: Position
  ) => void;
  updateElementSize: (
    elementId: number,
    isAvatar: boolean,
    newSize: TemplateSize
  ) => void;
  resetBackground: () => void;
  resetAvatar: () => void;
  updateTranscripts: (
    sceneId: number,
    transcriptId: number,
    newData: Partial<Scene['transcripts'][0]>
  ) => void;
  addTranscript: (sceneId: number, transcript: Transcript) => void;
  removeTranscript: (sceneId: number, transcriptId: number) => void;
  updateSubtitle: (sceneId: number, newSubtitle: Partial<Subtitle>) => void;
}
