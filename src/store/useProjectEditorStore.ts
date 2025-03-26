import { create } from 'zustand';

interface Scene {
  id: string;
  transcript: { id: string; text: string; postDelay: string }[];
  subtitle: {
    text: string;
    fontFamily: string;
    fontSize: number;
    fontColor: string;
    backgroundColor: string;
  };
  media: {
    type: string;
    url: string;
    position: {
      x: number;
      y: number;
    };
  };
  avatar: {
    type: string;
    url: string;
    position: {
      x: number;
      y: number;
    };
  };
}

interface Project {
  id: string;
  name: string;
  scenes: Scene[];
}

interface ProjectState {
  projectData: Project | null;
  // eslint-disable-next-line no-unused-vars
  setProjectData: (project: Project) => void;
  resetProjectData: () => void;
}

const useProjectEditorStore = create<ProjectState>((set) => ({
  projectData: null,
  setProjectData: (projectData) => set({ projectData }),
  resetProjectData: () => set({ projectData: null }),
}));

export default useProjectEditorStore;
