import { fetchProjects, postProjectScenes } from '@/api/project/api';
import useProjectEditorStore from '@/store/useProjectEditorStore';
import { useEffect, useState } from 'react';

const useProjectData = (projectId: string) => {
  const { projectData, setProjectData, resetProjectData } =
    useProjectEditorStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    resetProjectData();
    const loadProjects = async () => {
      try {
        const data = await fetchProjects(projectId);
        if (!data.scenes || data.scenes.length === 0) {
          data.scenes = await postProjectScenes(projectId);
        }
        setProjectData(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [projectId, resetProjectData, setProjectData]);

  return { projectData, loading, error };
};

export default useProjectData;
