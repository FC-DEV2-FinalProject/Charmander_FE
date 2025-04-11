import { useEffect } from 'react';
import { useDebounce } from '@/hook/useDebounce';
import { TemplateImage } from '@/types/template';

interface UsePatchTemplateProps {
  selectedIndex: number;
  debounceDelay?: number;
  projectId: number | undefined;
  sceneId: number | undefined;
  templates: TemplateImage[];
  patchFn: (
    // eslint-disable-next-line no-unused-vars
    projectId: number,
    // eslint-disable-next-line no-unused-vars
    sceneId: number,
    // eslint-disable-next-line no-unused-vars
    selectedTemplate: TemplateImage
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<any>;
}

export function usePatchTemplate({
  selectedIndex,
  debounceDelay = 1000,
  projectId,
  sceneId,
  templates,
  patchFn,
}: UsePatchTemplateProps) {
  const debouncedIndex = useDebounce(selectedIndex, debounceDelay);

  useEffect(() => {
    if (
      !projectId ||
      !sceneId ||
      debouncedIndex === -1 ||
      !templates[debouncedIndex]
    )
      return;

    const selectedTemplate = templates[debouncedIndex];
    const updateTemplate = async () => {
      try {
        await patchFn(projectId, sceneId, selectedTemplate);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(`템플릿 업데이트 실패: ${error}`);
      }
    };

    updateTemplate();
  }, [debouncedIndex, projectId, sceneId, templates, patchFn]);
}
