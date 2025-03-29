/* eslint-disable no-unused-vars */
import { TemplateBackground, TemplateSize } from './template';

export interface Position {
  x: number;
  y: number;
}
export interface ImageType {
  id: number;
  type: string;
  width: number;
  height: number;
  url: string;
  position: Position;
  scale: number;
  viewport: number[];
}
export interface Scene {
  id: number;
  transcript: { id: number; text: string; postDelay: string }[];
  subtitle: {
    text: string;
    fontFamily: string;
    fontSize: number;
    fontColor: string;
    backgroundColor: string;
    position: Position;
  };
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
  updateMedia: (template: TemplateBackground) => void;
  updateElementPosition: (isAvatar: boolean, newPosition: Position) => void;
  updateElementSize: (isAvatar: boolean, newSize: TemplateSize) => void;
  resetMedia: () => void;
}
