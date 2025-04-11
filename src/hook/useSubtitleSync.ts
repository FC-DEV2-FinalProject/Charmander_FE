import { useEffect } from 'react';
import { patchTranscript } from '@/api/project/api';
import { Project, Scene, Transcript } from '@/types/projectData';

export function useSubtitleSync({
  projectData,
  debouncedTranscripts,
  updateTranscripts,
}: {
  projectData: Project | null;
  debouncedTranscripts: Transcript[];
  updateTranscripts: (
    // eslint-disable-next-line no-unused-vars
    sceneId: number,
    // eslint-disable-next-line no-unused-vars
    transcriptId: number,
    // eslint-disable-next-line no-unused-vars
    newData: Partial<Scene['transcripts'][0]>
  ) => void;
}) {
  useEffect(() => {
    if (!projectData) return;

    const syncSubtitles = async () => {
      const originalSubtitles = projectData.scenes[0].transcripts ?? [];

      const modifiedSubtitles = debouncedTranscripts.filter((subtitle) => {
        const original = originalSubtitles.find((t) => t.id === subtitle.id);
        if (!original) return false;
        return (
          original.text !== subtitle.text ||
          original.property.speed !== subtitle.property.speed ||
          original.property.postDelay !== subtitle.property.postDelay
        );
      });

      if (modifiedSubtitles.length === 0) return;

      try {
        await Promise.all(
          modifiedSubtitles.map((subtitle) =>
            patchTranscript(
              projectData.id,
              projectData.scenes[0].id,
              subtitle.id,
              subtitle
            )
          )
        );
        modifiedSubtitles.forEach((subtitle) => {
          updateTranscripts(projectData.scenes[0].id, subtitle.id, subtitle);
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('자막 업데이트 실패:', error);
      }
    };

    syncSubtitles();
  }, [debouncedTranscripts, projectData, updateTranscripts]);
}
