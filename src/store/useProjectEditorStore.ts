import { ImageType, Position, ProjectState } from '@/types/projectData';
import { TemplateBackground, TemplateSize } from '@/types/template';
import { create } from 'zustand';

const useProjectEditorStore = create<ProjectState>((set) => ({
  projectData: null,

  setProjectData: (projectData) => set({ projectData }),

  resetProjectData: () => set({ projectData: null }),

  updateMedia: (template: TemplateBackground) => {
    set((state) => {
      if (!state.projectData || state.projectData.scenes.length === 0)
        return state;

      const newMedia: ImageType = {
        id: template.id,
        type: template.type,
        width: template.size.width,
        height: template.size.height,
        url: template.fileUrl,
        position: { x: 0, y: 0 },
        scale: 1,
        viewport: [0, 0, 100, 100],
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
                        width: newSize.width,
                        height: newSize.height,
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
}));

export default useProjectEditorStore;
