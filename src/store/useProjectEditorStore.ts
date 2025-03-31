import {
  ImageType,
  Position,
  ProjectState,
  Scene,
  Subtitle,
} from '@/types/projectData';
import { TemplateImage, TemplateSize } from '@/types/template';
import { create } from 'zustand';

const useProjectEditorStore = create<ProjectState>((set) => ({
  projectData: null,

  setProjectData: (projectData) => set({ projectData }),

  resetProjectData: () => set({ projectData: null }),

  updateMedia: (template: TemplateImage) => {
    set((state) => {
      if (!state.projectData || state.projectData.scenes.length === 0) {
        return state;
      }

      const newMedia: ImageType = {
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
              media: newMedia,
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
                  [isAvatar ? 'avatar' : 'media']: scene[
                    isAvatar ? 'avatar' : 'media'
                  ]
                    ? {
                        ...scene[isAvatar ? 'avatar' : 'media'],
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
                  [isAvatar ? 'avatar' : 'media']: scene[
                    isAvatar ? 'avatar' : 'media'
                  ]
                    ? {
                        ...scene[isAvatar ? 'avatar' : 'media'],
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

  resetMedia: () => {
    set((state) => {
      if (!state.projectData || state.projectData.scenes.length === 0)
        return state;

      return {
        projectData: {
          ...state.projectData,
          scenes: [
            {
              ...state.projectData.scenes[0],
              media: null,
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
