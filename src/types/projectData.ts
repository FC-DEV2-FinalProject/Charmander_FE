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
  media: ImageType;
  avatar: ImageType;
}

export interface Project {
  id: number;
  name: string;
  scenes: Scene[];
}

export interface ProjectState {
  projectData: Project | null;
  // eslint-disable-next-line no-unused-vars
  setProjectData: (project: Project) => void;
  // eslint-disable-next-line no-unused-vars
  updateMediaPosition: (newPosition: Position) => void;
  // eslint-disable-next-line no-unused-vars
  updateAvatarPosition: (newPosition: Position) => void;
  resetProjectData: () => void;
}
