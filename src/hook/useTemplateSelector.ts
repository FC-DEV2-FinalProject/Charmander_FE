import { useEffect, useMemo, useState } from 'react';
import { TemplateImage } from '@/types/template';

interface UseTemplateSelectorProps {
  templates: TemplateImage[];
  savedFileId?: string;
}

export function useTemplateSelector({
  templates,
  savedFileId,
}: UseTemplateSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    if (!templates || !savedFileId) return;
    const savedIndex = templates.findIndex(
      (template) => template.fileUrl === savedFileId
    );
    if (savedIndex !== -1 && selectedIndex === -1) {
      setSelectedIndex(savedIndex);
    }
  }, [savedFileId, templates, selectedIndex]);

  const selectedTemplate = useMemo(() => {
    if (selectedIndex === -1 || !templates[selectedIndex]) {
      return null;
    }
    return templates[selectedIndex];
  }, [selectedIndex, templates]);

  return { selectedIndex, setSelectedIndex, selectedTemplate };
}
