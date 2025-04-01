import useProjectEditorStore from '@/store/useProjectEditorStore';
import { deleteTranscript, postTranscript, suggestArticleScript } from './api';
import { Transcript } from '@/types/projectData';

export async function updateAndCleanupTranscripts(article: string) {
  const { projectData, updateTranscripts, addTranscript, removeTranscript } =
    useProjectEditorStore.getState();
  if (!projectData) return;

  const currentScene = projectData.scenes[0];
  let currentTranscripts = currentScene.transcripts;

  let transcriptsFromAPI;
  try {
    transcriptsFromAPI = await suggestArticleScript(article);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('suggestArticleScript 호출 실패:', error);
    return;
  }

  // 1. 기존 transcript 업데이트 / 신규 생성 및 추가
  for (let i = 0; i < transcriptsFromAPI.result.length; i++) {
    try {
      if (currentTranscripts[i]) {
        updateTranscripts(currentScene.id, currentTranscripts[i].id, {
          text: transcriptsFromAPI.result[i].transcript,
        });
        currentTranscripts =
          useProjectEditorStore.getState().projectData!.scenes[0].transcripts;
      } else {
        const newTranscript: Transcript = await postTranscript(
          projectData.id,
          currentScene.id
        );
        newTranscript.text = transcriptsFromAPI.result[i].transcript;
        addTranscript(currentScene.id, newTranscript);
        currentTranscripts =
          useProjectEditorStore.getState().projectData!.scenes[0].transcripts;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`transcript 처리 중 오류 (index ${i}):`, error);
    }
  }

  // 2. 남는 transcript 삭제
  currentTranscripts =
    useProjectEditorStore.getState().projectData!.scenes[0].transcripts;
  if (currentTranscripts.length > transcriptsFromAPI.result.length) {
    const transcriptsToDelete = currentTranscripts.slice(
      transcriptsFromAPI.result.length
    );
    for (const transcript of transcriptsToDelete) {
      try {
        await deleteTranscript(projectData.id, currentScene.id, transcript.id);
        removeTranscript(currentScene.id, transcript.id);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`transcript ${transcript.id} 삭제 실패:`, error);
      }
    }
  }
}
