import theme from '@/styles/theme';
import styled from 'styled-components';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import type { BannerSliderType } from '@/types/types';

function BannerSlider({ images }: BannerSliderType) {
  const settings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    speed: 500,
    dots: true,
    dotsClass: 'custom-dots',
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    draggable: true,
    arrows: false,
    customPaging: function () {
      return <div className="custom-dot"></div>;
    },
  };

  return (
    <S.SliderWrapper>
      <S.SliderContainer>
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index}>
              <img
                src={image}
                alt={`logoBanner-${index}`}
              />
            </div>
          ))}
        </Slider>
      </S.SliderContainer>
    </S.SliderWrapper>
  );
}

const S = {
  SliderWrapper: styled.div`
    width: 100%;
    height: 70%;
    position: relative;
  `,
  SliderContainer: styled.div`
    width: 100%;
    height: 100%;
    overflow: visible;
    position: relative;

    .slick-slider {
      width: 100%;
      height: 100%;
    }

    .slick-list,
    .slick-track {
      height: 100%;
    }

    .custom-dots {
      margin-top: 3vh;
      position: absolute;
      display: flex !important;
      justify-content: flex-start;
      width: 5vw;
      padding: 0;
      list-style: none;
      text-align: left;
      gap: 5%;
    }

    .custom-dots li {
      flex-grow: 0.5;
      height: 0.8vh;
      cursor: pointer;
      transition: flex-grow 0.3s ease;
    }

    .custom-dots li .custom-dot {
      width: 100%;
      height: 100%;
      background-color: ${theme.colors.lightGray3};
      border-radius: ${theme.radius.large};
      transition: all 0.3s ease;
    }

    .custom-dots li.slick-active {
      flex-grow: 2;
    }

    .custom-dots li.slick-active .custom-dot {
      background-color: ${theme.colors.lightGray2};
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `,
};

export default BannerSlider;
