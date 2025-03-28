import { ProjectState } from '@/types/projectData';
import { create } from 'zustand';

const useProjectEditorStore = create<ProjectState>((set) => ({
  projectData: null,

  setProjectData: (projectData) => set({ projectData }),

  resetProjectData: () => set({ projectData: null }),

  updateMediaPosition: (newPosition) => {
    set((state) => {
      if (!state.projectData || state.projectData.scenes.length === 0)
        return state;

      return {
        projectData: {
          ...state.projectData,
          scenes: [
            {
              ...state.projectData.scenes[0], // 항상 첫 번째 scene만 업데이트
              media: {
                ...state.projectData.scenes[0].media,
                position: newPosition,
              },
            },
          ],
        },
      };
    });
  },

  updateAvatarPosition: (newPosition) => {
    set((state) => {
      if (!state.projectData || state.projectData.scenes.length === 0)
        return state;

      return {
        projectData: {
          ...state.projectData,
          scenes: [
            {
              ...state.projectData.scenes[0], // 항상 첫 번째 scene만 업데이트
              media: {
                ...state.projectData.scenes[0].media,
                position: newPosition,
              },
            },
          ],
        },
      };
    });
  },
}));

export default useProjectEditorStore;
