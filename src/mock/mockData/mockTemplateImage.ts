import image1 from '@/mock/mockImage/news/CK_psxtg0828506.jpg';
import image2 from '@/mock/mockImage/news/CK_ti436a26701.jpg';
import image3 from '@/mock/mockImage/news/CK_ti436a26703.jpg';
import image4 from '@/mock/mockImage/news/CK_ti436a26706.jpg';
import image5 from '@/mock/mockImage/news/CK_tii219a0206.jpg';
import image6 from '@/mock/mockImage/news/CK_tii219a0208.jpg';
import avatar1 from '@/mock/mockImage/AVATAR/Jihun_01A.png';
import avatar2 from '@/mock/mockImage/AVATAR/Jihun_02A.png';
import avatar3 from '@/mock/mockImage/AVATAR/Jihun_04A.png';
import avatar4 from '@/mock/mockImage/AVATAR/Jina_02J.png';
import avatar5 from '@/mock/mockImage/AVATAR/Jisoo_02A.png';
import avatar6 from '@/mock/mockImage/AVATAR/Mateo_01A.png';
import avatar7 from '@/mock/mockImage/AVATAR/Mateo_06A.png';
import avatar8 from '@/mock/mockImage/AVATAR/Mina_03A.png';
import avatar9 from '@/mock/mockImage/AVATAR/Sora_02B.png';
import avatar10 from '@/mock/mockImage/AVATAR/Yura_02A.png';

export const mockTemplateImage = () => {
  const templates: Template[] = [
    {
      id: '1',
      type: '사회',
      url: image1,
      position: {
        x: 0,
        y: 0,
      },
    },
    {
      id: '2',
      type: '사회',
      url: image2,
      position: {
        x: 0,
        y: 0,
      },
    },
    {
      id: '3',
      type: '정치',
      url: image3,
      position: {
        x: 0,
        y: 0,
      },
    },
    {
      id: '4',
      type: '정치',
      url: image4,
      position: {
        x: 0,
        y: 0,
      },
    },
    {
      id: '5',
      type: '정치',
      url: image5,
      position: {
        x: 0,
        y: 0,
      },
    },
    {
      id: '6',
      type: '경제',
      url: image6,
      position: {
        x: 0,
        y: 0,
      },
    },
  ];
  const avatarTemplates: Template[] = [
    {
      id: '7',
      type: '경제',
      url: avatar1,
      position: {
        x: 0,
        y: 0,
      },
    },
    {
      id: '8',
      type: '경제',
      url: avatar2,
      position: {
        x: 0,
        y: 0,
      },
    },
    {
      id: '9',
      type: '경제',
      url: avatar3,
      position: {
        x: 0,
        y: 0,
      },
    },
    {
      id: '10',
      type: '정치',
      url: avatar4,
      position: {
        x: 0,
        y: 0,
      },
    },
    {
      id: '11',
      type: '정치',
      url: avatar5,
      position: {
        x: 0,
        y: 0,
      },
    },
    {
      id: '12',
      type: '정치',
      url: avatar6,
      position: {
        x: 0,
        y: 0,
      },
    },
    {
      id: '13',
      type: '사회',
      url: avatar7,
      position: {
        x: 0,
        y: 0,
      },
    },
    {
      id: '14',
      type: '사회',
      url: avatar8,
      position: {
        x: 0,
        y: 0,
      },
    },
    {
      id: '15',
      type: '사회',
      url: avatar9,
      position: {
        x: 0,
        y: 0,
      },
    },
    {
      id: '16',
      type: '사회',
      url: avatar10,
      position: {
        x: 0,
        y: 0,
      },
    },
  ];
  return { templates, avatarTemplates };
};

export type Template = {
  id: string;
  type: string;
  url: string;
  position: {
    x: number;
    y: number;
  };
};
