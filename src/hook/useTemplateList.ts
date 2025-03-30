import { useQuery } from '@tanstack/react-query';
import { fetchTemplate } from '@/api/project/api';

const useTemplates = () => {
  const templatesQuery = useQuery({
    queryKey: ['templateList'],
    queryFn: () => fetchTemplate(),
    staleTime: 1000 * 60 * 5,
  });
  return {
    templatesQuery,
  };
};

export { useTemplates };
