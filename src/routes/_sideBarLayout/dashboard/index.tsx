import styled from 'styled-components';
import { createFileRoute, Link } from '@tanstack/react-router';
import MyProjectCard from './_components/myProjectCard';
import { getProjects, postProject } from '@/api/dashboard/api';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useEffect, useState } from 'react';
import { useDialog } from '@/hook/useDialog';
import LeftArrowIcon from '@/assets/icons/icon-slide-left-arrow.svg?react';
import RightArrowIcon from '@/assets/icons/icon-slide-right-arrow.svg?react';
import { FaPlus } from 'react-icons/fa6';
import Chart from './_components/chart';
import Guide from './_components/guide';
import { useNavigate } from '@tanstack/react-router';

export const Route = createFileRoute('/_sideBarLayout/dashboard/')({
  component: RouteComponent,
});

interface IProject {
  id: number;
  name: string;
  active: boolean;
  version: number;
  lastAccessedAt: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * RouteComponent
 *
 * - _sideBarLayout/dashboard/ route component
 * - My Project card list with slider
 * - Video Statistics
 * - Guide
 *
 * @returns react component
 */
function RouteComponent() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const { alert } = useDialog();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data.data);
      } catch (err) {
        alert(`${err}`);
      }
    };

    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _handlecreateProject = async () => {
    try {
      const projectData = await postProject();

      if (projectData) {
        navigate({ to: `/${projectData.id}/article` });
      }
    } catch (err) {
      alert(`${err}`);
    }
  };
  function SampleNextArrow(props: { onClick?: () => void }) {
    const { onClick } = props;
    return (
      <S.NextArrow onClick={onClick}>
        <RightArrowIcon color="#CDCDCD" />
      </S.NextArrow>
    );
  }

  function SamplePrevArrow(props: { onClick?: () => void }) {
    const { onClick } = props;
    return (
      <S.PrevArrow onClick={onClick}>
        <LeftArrowIcon color="#CDCDCD" />
      </S.PrevArrow>
    );
  }

  const settings = {
    infinite: false,
    // slidesToShow: Math.min(projects.length, slidesToShow),
    slidesToScroll: 1,
    draggable: true,
    arrows: true,
    centerPadding: '100px',
    variableWidth: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <S.DashboardWrap>
      <S.MyProjectContainer>
        <h2>
          <Link to="/my-project">
            내 프로젝트
            <span
              style={{
                marginLeft: '10px',
                paddingTop: '5px',
              }}>
              <RightArrowIcon
                color="#555"
                width={10}
              />
            </span>
          </Link>
        </h2>
        {projects && projects.length > 0 ? (
          <Slider {...settings}>
            {projects.map((project) => {
              return (
                <MyProjectCard
                  key={project.id}
                  {...project}
                />
              );
            })}
          </Slider>
        ) : (
          <S.EmptyProjectCard onClick={_handlecreateProject}>
            <div>
              <FaPlus
                size={40}
                color="#0C2764"
              />
            </div>
            <h3>프로젝트 생성</h3>
            <p>
              프로젝트를 생성하여 <br /> 나만의 영상을 제작해보세요.
            </p>
          </S.EmptyProjectCard>
        )}
      </S.MyProjectContainer>
      <S.DashboardContent>
        <S.VideoStatistics>
          <h3>조회수 통계</h3>
          <Chart />
        </S.VideoStatistics>
        <S.GuideWrap>
          <h3>이용 가이드</h3>
          <Guide />
        </S.GuideWrap>
      </S.DashboardContent>
    </S.DashboardWrap>
  );
}

const S = {
  DashboardWrap: styled.div``,
  MyProjectContainer: styled.div`
    position: relative;
    padding-top: 50px;
    padding-left: 50px;
    margin-bottom: 20px;

    h2 {
      margin-bottom: 30px;
      font-size: ${({ theme }) => theme.fontSizes.fz20};
      font-weight: ${({ theme }) => theme.fontWeights.medium};
      transition: all 0.3s ease-in-out;

      a {
        display: flex;
        align-items: center;
      }

      &:hover {
        opacity: 0.7;
      }
    }
  `,
  DashboardContent: styled.div`
    display: flex;
    margin-top: 70px;
    margin-bottom: 50px;
    padding: 0 50px;
    gap: 20px;
  `,
  VideoStatistics: styled.div`
    flex: 1;
    width: 70%;
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: ${({ theme }) => theme.radius.small};
    box-shadow: ${({ theme }) => theme.boxShadow.subtle};
    padding: 15px;

    h3 {
      font-size: ${({ theme }) => theme.fontSizes.fz18};
      font-weight: ${({ theme }) => theme.fontWeights.medium};
      color: ${({ theme }) => theme.colors.primary};
    }
  `,
  GuideWrap: styled.div`
    width: 30%;
    min-width: 350px;
    max-width: 550px;
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: ${({ theme }) => theme.radius.small};
    box-shadow: ${({ theme }) => theme.boxShadow.subtle};
    padding: 20px 15px;

    h3 {
      font-size: ${({ theme }) => theme.fontSizes.fz18};
      font-weight: ${({ theme }) => theme.fontWeights.medium};
      color: ${({ theme }) => theme.colors.primary};
    }
  `,

  EmptyProjectCard: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 250px;
    padding: 40px 20px;
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: ${({ theme }) => theme.radius.small};
    box-shadow: ${({ theme }) => theme.boxShadow.subtle};
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease-in-out;

    div {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 80px;
      height: 80px;
      border-radius: ${({ theme }) => theme.radius.circle};
      background-color: ${({ theme }) => theme.colors.background2};
    }

    h3 {
      margin-top: 30px;
      font-weight: ${({ theme }) => theme.fontWeights.medium};
      color: ${({ theme }) => theme.colors.primary};
    }

    p {
      margin-top: 10px;
      font-size: ${({ theme }) => theme.fontSizes.fz14};
      line-height: ${({ theme }) => theme.lineHeights.small};
      color: ${({ theme }) => theme.colors.textSecond};
    }

    &:hover {
      background-color: ${({ theme }) => theme.colors.primary};
      h3,
      p {
        color: ${({ theme }) => theme.colors.white};
      }
    }
  `,

  // 슬라이드 버튼 커스텀
  NextArrow: styled.div`
    position: absolute;
    top: -65px;
    right: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: ${({ theme }) => theme.radius.circle};
    border: 2.5px solid ${({ theme }) => theme.colors.lightGray2};
    cursor: pointer;
    transition: all 0.3s ease-in-out;

    svg {
      margin-left: 3px;
    }

    &:hover {
      border: 2.5px solid ${({ theme }) => theme.colors.primary};
      background-color: ${({ theme }) => theme.colors.primary};
      svg {
        color: white;
      }
    }
  `,
  PrevArrow: styled.div`
    position: absolute;
    top: -65px;
    right: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: ${({ theme }) => theme.radius.circle};
    border: 2.5px solid ${({ theme }) => theme.colors.lightGray2};
    cursor: pointer;
    transition: all 0.3s ease-in-out;

    svg {
      margin-right: 3px;
    }

    &:hover {
      border: 2.5px solid ${({ theme }) => theme.colors.primary};
      background-color: ${({ theme }) => theme.colors.primary};

      svg {
        color: white;
      }
    }
  `,
};

export default RouteComponent;
