import { useQuery } from '@tanstack/react-query';
import { fetchTemplate, fetchTemplateCategories } from '@/api/project/api';
import { TemplateCategories } from '@/types/template';

const useTemplates = () => {
  const templatesQuery = useQuery({
    queryKey: ['templateList'],
    queryFn: () => fetchTemplate(),
    staleTime: 1000 * 60 * 5,
  });
  const templateCategoriesQuery = useQuery<TemplateCategories>({
    queryKey: ['templateCategories'],
    queryFn: () => fetchTemplateCategories(),
    staleTime: 1000 * 60 * 5,
  });
  return {
    templatesQuery,
    templateCategoriesQuery,
  };
};

export { useTemplates };
