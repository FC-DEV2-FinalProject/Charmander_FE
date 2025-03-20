import image1 from '@/assets/loginBanner/image1.png';
import image2 from '@/assets/loginBanner/image2.png';
import image3 from '@/assets/loginBanner/image3.png';

export const mockTemplateImage = () => {
  const templates: Template[] = [
    { id: '1', name: '템플릿 1', imageUrl: image1 },
    { id: '2', name: '템플릿 2', imageUrl: image2 },
    { id: '3', name: '템플릿 1', imageUrl: image3 },
    { id: '4', name: '템플릿 3', imageUrl: image1 },
    { id: '5', name: '템플릿 1', imageUrl: image2 },
    { id: '6', name: '템플릿 3', imageUrl: image3 },
  ];
  return templates;
};

export type Template = {
  id: string;
  name: string;
  imageUrl: string;
};
