import {
  ImageType,
  Position,
  ProjectState,
  Scene,
  Subtitle,
  SuggestProjectData,
  Transcript,
} from '@/types/projectData';
import { TemplateImage, TemplateSize } from '@/types/template';
import { create } from 'zustand';

const useProjectEditorStore = create<ProjectState>((set) => ({
  projectData: null,

  setProjectData: (projectData) => set({ projectData }),

  resetProjectData: () => set({ projectData: null }),
  setSuggestProjectData: (newData: SuggestProjectData) => {
    set((state) => {
      if (!state.projectData) return state;

      const { avatar, background } = newData;

      return {
        projectData: {
          ...state.projectData,
          scenes: state.projectData.scenes.map((scene) => ({
            ...scene,
            avatar: avatar
              ? {
                  id: avatar.id,
                  name: avatar.name,
                  priority: avatar.priority,
                  type: avatar.type,
                  fileUrl: avatar.fileUrl,
                  position: { x: 0, y: 0 },
                  size: avatar.size,
                  scale: 1,
                  viewport: [0, 0, 100, 100],
                  createdAt: avatar.createdAt,
                  updatedAt: avatar.updatedAt,
                }
              : null,
            background: background
              ? {
                  id: background.id,
                  name: background.name,
                  priority: background.priority,
                  type: background.type,
                  fileUrl: background.fileUrl,
                  position: { x: 0, y: 0 },
                  size: background.size,
                  scale: 1,
                  viewport: [0, 0, 100, 100],
                  createdAt: background.createdAt,
                  updatedAt: background.updatedAt,
                }
              : null,
          })),
        },
      };
    });
  },

  updateBackground: (template: TemplateImage) => {
    set((state) => {
      if (!state.projectData || state.projectData.scenes.length === 0) {
        return state;
      }

      const newBackground: ImageType = {
        id: template.id,
        name: template.name,
        priority: template.priority,
        type: template.type,
        fileUrl: template.fileUrl,
        position: { x: 0, y: 0 },
        size: template.size,
        scale: 1,
        viewport: [0, 0, 100, 100],
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
      };

      return {
        projectData: {
          ...state.projectData,
          scenes: [
            {
              ...state.projectData.scenes[0],
              background: newBackground,
            },
          ],
        },
      };
    });
  },
  updateAvatar: (template: TemplateImage) => {
    set((state) => {
      if (!state.projectData || state.projectData.scenes.length === 0)
        return state;

      const newAvatar: ImageType = {
        id: template.id,
        name: template.name,
        priority: template.priority,
        type: template.type,
        fileUrl: template.fileUrl,
        position: { x: 0, y: 0 },
        size: template.size,
        scale: 1,
        viewport: [0, 0, 100, 100],
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
      };

      return {
        projectData: {
          ...state.projectData,
          scenes: [
            {
              ...state.projectData.scenes[0],
              avatar: newAvatar,
            },
          ],
        },
      };
    });
  },

  updateElementPosition: (isAvatar: boolean, newPosition: Position) => {
    set((state) => {
      if (!state.projectData || !state.projectData.scenes.length) return state;

      return {
        projectData: {
          ...state.projectData,
          scenes: state.projectData.scenes.map((scene, index) =>
            index === 0
              ? {
                  ...scene,
                  [isAvatar ? 'avatar' : 'background']: scene[
                    isAvatar ? 'avatar' : 'background'
                  ]
                    ? {
                        ...scene[isAvatar ? 'avatar' : 'background'],
                        position: newPosition,
                      }
                    : null,
                }
              : scene
          ),
        },
      };
    });
  },

  updateElementSize: (isAvatar: boolean, newSize: TemplateSize) => {
    set((state) => {
      if (!state.projectData || !state.projectData.scenes.length) return state;

      return {
        projectData: {
          ...state.projectData,
          scenes: state.projectData.scenes.map((scene, index) =>
            index === 0
              ? {
                  ...scene,
                  [isAvatar ? 'avatar' : 'background']: scene[
                    isAvatar ? 'avatar' : 'background'
                  ]
                    ? {
                        ...scene[isAvatar ? 'avatar' : 'background'],
                        size: newSize,
                      }
                    : null,
                }
              : scene
          ),
        },
      };
    });
  },

  resetBackground: () => {
    set((state) => {
      if (!state.projectData || state.projectData.scenes.length === 0)
        return state;

      return {
        projectData: {
          ...state.projectData,
          scenes: [
            {
              ...state.projectData.scenes[0],
              background: null,
            },
          ],
        },
      };
    });
  },
  updateTranscripts: (
    sceneId: number,
    transcriptId: number,
    newData: Partial<Scene['transcripts'][0]>
  ) => {
    set((state) => {
      if (!state.projectData) return state;

      return {
        projectData: {
          ...state.projectData,
          scenes: state.projectData.scenes.map((scene) =>
            scene.id === sceneId
              ? {
                  ...scene,
                  transcripts: scene.transcripts.map((t) =>
                    t.id === transcriptId ? { ...t, ...newData } : t
                  ),
                }
              : scene
          ),
        },
      };
    });
  },

  addTranscript: (sceneId: number, transcript: Transcript) => {
    set((state) => {
      if (!state.projectData) return state;
      return {
        projectData: {
          ...state.projectData,
          scenes: state.projectData.scenes.map((scene) =>
            scene.id === sceneId
              ? {
                  ...scene,
                  transcripts: [...scene.transcripts, transcript],
                }
              : scene
          ),
        },
      };
    });
  },

  removeTranscript: (sceneId: number, transcriptId: number) => {
    set((state) => {
      if (!state.projectData) return state;
      return {
        projectData: {
          ...state.projectData,
          scenes: state.projectData.scenes.map((scene) =>
            scene.id === sceneId
              ? {
                  ...scene,
                  transcripts: scene.transcripts.filter(
                    (t) => t.id !== transcriptId
                  ),
                }
              : scene
          ),
        },
      };
    });
  },

  updateSubtitle: (sceneId: number, newSubtitle: Partial<Subtitle>) => {
    set((state) => {
      if (!state.projectData) return state;

      return {
        projectData: {
          ...state.projectData,
          scenes: state.projectData.scenes.map((scene) =>
            scene.id === sceneId
              ? { ...scene, subtitle: { ...scene.subtitle, ...newSubtitle } }
              : scene
          ),
        },
      };
    });
  },
}));

export default useProjectEditorStore;
