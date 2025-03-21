import { createFileRoute } from '@tanstack/react-router';
import FileEditIcon from '@/assets/icons/icon-file-edit.svg?react';
import styled from 'styled-components';
import Loading from '@/components/common/spinner';

export const Route = createFileRoute(
  '/_sideBarLayout/dashboard/_components/myProjectCard'
)({
  component: MyProjectCard,
});

interface ProjectProps {
  title: string;
  updatedAt: string;
  isLoaded: boolean;
  progress: number;
}

function MyProjectCard({ title, updatedAt, isLoaded, progress }: ProjectProps) {
  return (
    <S.CardWrap>
      <S.CardImage>
        <img
          src="https://img.freepik.com/free-vector/travelling-vlogger-youtube-thumbnail_23-2148569009.jpg?t=st=1742305833~exp=1742309433~hmac=5b39ca884dabf487b4c8452fa8cdcc0c787b80a25da38b7fc3e1aa1352deb182&w=2000"
          alt="test-img"
        />
        {isLoaded && (
          <S.CardBackDrop>
            <S.LoadingIcon>
              <Loading />
            </S.LoadingIcon>
            <S.ProgressState>
              <p>{progress}%</p>
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
          <h4>{title}</h4>
          <p>{updatedAt}</p>
        </div>
      </S.CardContent>
    </S.CardWrap>
  );
}

export default MyProjectCard;

const S = {
  CardWrap: styled.div`
    width: 380px;
    margin-right: 30px;
  `,
  CardImage: styled.div`
    position: relative;
    height: 225px;
    border-radius: ${({ theme }) => theme.radius.small};
    overflow: hidden;

    > img {
      width: 100%;
      height: 100%;
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
