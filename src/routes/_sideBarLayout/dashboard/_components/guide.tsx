import { createFileRoute } from '@tanstack/react-router';
import styled from 'styled-components';
import { FaPlay } from 'react-icons/fa';
import { useDialog } from '@/hook/useDialog';

export const Route = createFileRoute(
  '/_sideBarLayout/dashboard/_components/guide'
)({
  component: Guide,
});

function Guide() {
  const { alert } = useDialog();

  const _handleClick = () => {
    alert('서비스 준비중입니다.');
  };
  return (
    <S.GuideWrap>
      <ul>
        <li onClick={_handleClick}>
          <img
            src="https://img.freepik.com/free-vector/tiny-people-with-guide-instructions-handbooks-flat-vector-illustration-cartoon-characters-reading-user-manual-guidebook-guidance-help-book-with-instructions-use-concept_74855-10173.jpg?t=st=1742483395~exp=1742486995~hmac=225d81ffff8bdbaaa11a7f0f1f92261f18fb5bcf59e0169361712e6f4fd32627&w=1800"
            alt="guide-image"
          />
          <div>
            <p>
              <FaPlay
                size={30}
                color="white"
              />
            </p>
          </div>
        </li>
        <li onClick={_handleClick}>
          <img
            src="https://img.freepik.com/free-vector/user-guide-isometric-landing-page-manual-book_107791-8279.jpg?t=st=1742483299~exp=1742486899~hmac=bf1ad2dd0828150b2f75a600266a54e3a4e6da432c587c6d5b693ae17a8ada55&w=2000"
            alt="guide-image"
          />
          <div>
            <p>
              <FaPlay
                size={30}
                color="white"
              />
            </p>
          </div>
        </li>
      </ul>
    </S.GuideWrap>
  );
}

export default Guide;

const S = {
  GuideWrap: styled.div`
    margin-top: 20px;

    ul {
      width: 100%;

      li {
        width: 100%;
        aspect-ratio: 16 / 9;
        margin-bottom: 20px;
        border-radius: ${({ theme }) => theme.radius.large};
        position: relative;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s ease-in-out;

        img {
          width: 100%;
          object-fit: contain;
          transition: all 0.3s ease-in-out;
        }

        div {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(0, 0, 0, 0.2);

          p {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 80px;
            height: 80px;
            border-radius: ${({ theme }) => theme.radius.circle};
            background-color: rgba(0, 0, 0, 0.4);
            box-shadow: ${({ theme }) => theme.boxShadow.subtle};
          }
        }

        &:hover {
          box-shadow: ${({ theme }) => theme.boxShadow.regular};
          img {
            transform: scale(1.05);
          }
        }
      }
    }
  `,
};
