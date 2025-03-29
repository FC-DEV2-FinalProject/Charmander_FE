import { createFileRoute, Link } from '@tanstack/react-router';
import FileEditIcon from '@/assets/icons/icon-file-edit.svg?react';
import styled from 'styled-components';
import Loading from '@/components/common/spinner';

export const Route = createFileRoute(
  '/_sideBarLayout/dashboard/_components/myProjectCard'
)({
  component: MyProjectCard,
});

interface ProjectProps {
  id: number;
  name: string;
  active: boolean;
  version: number;
  lastAccessedAt: string;
  createdAt: string;
  updatedAt: string;
}

function MyProjectCard({
  id,
  name,
  active,
  // version,
  // lastAccessedAt,
  // createdAt,
  updatedAt,
}: ProjectProps) {
  return (
    <Link to={`/${id}/article`}>
      <S.CardWrap>
        <S.CardImage className="card-image">
          {/* 추후 받은 이미지로 변경 해야합니다 */}
          <img
            src="https://img.freepik.com/free-vector/staff-creating-film_1262-20681.jpg?t=st=1742560845~exp=1742564445~hmac=c96983f5ebf8d7db96d12092ed3ffe4ffe7eefbfec031d8de5d8eaaa804e80ca&w=1800"
            alt="test-img"
          />
          {active && (
            <S.CardBackDrop>
              <S.LoadingIcon>
                <Loading />
              </S.LoadingIcon>
              <S.ProgressState>
                <p>{`75`}%</p>
                <S.ProgressBarWrap>
                  <S.ProgressBar></S.ProgressBar>
                </S.ProgressBarWrap>
              </S.ProgressState>
            </S.CardBackDrop>
          )}
        </S.CardImage>
        <S.CardContent>
          <p>
            <FileEditIcon />
          </p>
          <div>
            <h4>{name}</h4>
            <p>{updatedAt}</p>
          </div>
        </S.CardContent>
      </S.CardWrap>
    </Link>
  );
}

export default MyProjectCard;

const S = {
  CardWrap: styled.div`
    width: 380px;
    margin-right: 30px;
    cursor: pointer;

    &:hover {
      > div.card-image {
        box-shadow: ${({ theme }) => theme.boxShadow.subtle};
      }
      img {
        transform: scale(1.05);
      }
    }
  `,
  CardImage: styled.div`
    position: relative;
    height: 225px;
    border-radius: ${({ theme }) => theme.radius.small};
    border: 1px solid ${({ theme }) => theme.colors.background2};
    transition: all 0.3s ease-in-out;
    overflow: hidden;

    > img {
      width: 100%;
      height: 100%;
      transition: all 0.3s ease-in-out;
    }
  `,

  CardBackDrop: styled.div`
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
  `,

  LoadingIcon: styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  `,

  ProgressState: styled.div`
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 20px 25px;
    p {
      font-size: ${({ theme }) => theme.fontSizes.fz14};
      text-align: right;
      color: ${({ theme }) => theme.colors.white};
    }
  `,
  ProgressBarWrap: styled.div`
    width: 100%;
    height: 6px;
    margin-top: 8px;
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: ${({ theme }) => theme.radius.small};
    overflow: hidden;
  `,
  ProgressBar: styled.div`
    width: 75%;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.secondary1};
  `,

  CardContent: styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-top: 10px;

    > p {
      margin-right: 10px;
      padding-top: 5px;
    }

    div {
      h4 {
        font-size: ${({ theme }) => theme.fontSizes.fz16};
      }

      p {
        font-size: ${({ theme }) => theme.fontSizes.fz14};
        color: ${({ theme }) => theme.colors.darkGray2};
      }
    }
  `,
};
