import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import styled from 'styled-components';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import media from '@/styles/media';
import YoutubeIcon from '@/assets/icons/icon-youtube.png';

export const Route = createFileRoute(
  '/_sideBarLayout/dashboard/_components/chart'
)({
  component: Chart,
});

type TabKey = 'day' | 'week' | 'month';

const data: Record<
  TabKey,
  { name: string; 조회수: number; 구독자수: number }[]
> = {
  day: [
    { name: '1일', 조회수: 4000, 구독자수: 2400 },
    { name: '2일', 조회수: 23400, 구독자수: 1398 },
    { name: '3일', 조회수: 300, 구독자수: 1318 },
    { name: '4일', 조회수: 302, 구독자수: 5398 },
    { name: '5일', 조회수: 3020, 구독자수: 2398 },
    { name: '6일', 조회수: 30010, 구독자수: 3498 },
    { name: '7일', 조회수: 2400, 구독자수: 1398 },
    { name: '8일', 조회수: 234, 구독자수: 1398 },
    { name: '9일', 조회수: 6456, 구독자수: 1398 },
    { name: '10일', 조회수: 1231, 구독자수: 1398 },
    { name: '11일', 조회수: 7453, 구독자수: 1398 },
  ],
  week: [
    { name: '1주', 조회수: 8000, 구독자수: 5400 },
    { name: '2주', 조회수: 5000, 구독자수: 4398 },
    { name: '4주', 조회수: 3000, 구독자수: 3398 },
    { name: '4주', 조회수: 8000, 구독자수: 7398 },
  ],
  month: [
    { name: 'Jan', 조회수: 8000, 구독자수: 8400 },
    { name: 'Feb', 조회수: 65000, 구독자수: 35298 },
    { name: 'Mar', 조회수: 3500, 구독자수: 7398 },
    { name: 'Apr', 조회수: 1123, 구독자수: 7398 },
    { name: 'May', 조회수: 1230, 구독자수: 7398 },
    { name: 'Jun', 조회수: 1560, 구독자수: 7398 },
    { name: 'Jul', 조회수: 63400, 구독자수: 7398 },
    { name: 'Aug', 조회수: 7300, 구독자수: 7398 },
    { name: 'Sep', 조회수: 7000, 구독자수: 7398 },
    { name: 'Oct', 조회수: 6000, 구독자수: 7398 },
    { name: 'Nov', 조회수: 1000, 구독자수: 7398 },
    { name: 'Dec', 조회수: 9000, 구독자수: 7398 },
  ],
};

const tabMenus = [
  { label: '일별', value: 'day' },
  { label: '주', value: 'week' },
  { label: '월', value: 'month' },
];

function Chart() {
  const [activeTab, setActiveTab] = useState<TabKey>('day');
  const [youtubeSync, setYouTubeSync] = useState<boolean>(false);

  const _handleYoutubeSync = () => {
    setYouTubeSync(!youtubeSync);
  };

  return (
    <>
      {youtubeSync ? (
        <>
          {' '}
          <S.Tab>
            {tabMenus.map((menu, i) => (
              <S.TabItem
                key={i}
                isActive={activeTab === menu.value}
                onClick={() => setActiveTab(menu.value as TabKey)}>
                {menu.label}
              </S.TabItem>
            ))}
          </S.Tab>
          <S.ChartWrap>
            <ResponsiveContainer
              width="100%"
              height="100%">
              <LineChart
                width={500}
                height={300}
                data={data[activeTab]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid
                  strokeDasharray="0 0"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#acacac', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#acacac', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="구독자수"
                  stroke="#0C2764"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="조회수"
                  stroke="#8B8B9D"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </S.ChartWrap>
        </>
      ) : (
        <>
          <S.NoneChart>
            <S.NoneChartContent>
              <p>
                유튜브 계정을 연동하시면, <br />
                <span>AIVATAR</span>에서 만든 영상을 유튜브에 바로 업로드하고
                조회수를 확인할 수 있습니다.
              </p>
            </S.NoneChartContent>

            <S.SyncBtnWrap onClick={_handleYoutubeSync}>
              <div>
                <img
                  src={YoutubeIcon}
                  alt="YoutubeIcon"
                />
              </div>
              <p>
                <span>Youtube 연동하기</span>
              </p>
            </S.SyncBtnWrap>
          </S.NoneChart>
        </>
      )}
    </>
  );
}

export default Chart;

const S = {
  Tab: styled.ul`
    display: flex;
    margin-top: 20px;
    width: fit-content;
    border: 1px solid ${({ theme }) => theme.colors.lightGray2};
    border-radius: ${({ theme }) => theme.radius.xsmall};
    overflow: hidden;
  `,
  TabItem: styled.li<{ isActive: boolean }>`
    text-align: center;
    width: 75px;
    height: 45px;
    border-right: 1px solid ${({ theme }) => theme.colors.lightGray2};
    font-size: ${({ theme }) => theme.fontSizes.fz14};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    line-height: 45px;
    cursor: pointer;
    background: ${({ isActive, theme }) =>
      isActive ? theme.colors.primary : theme.colors.white};
    color: ${({ isActive, theme }) =>
      isActive ? theme.colors.white : theme.colors.text};

    &:last-child {
      border-right: none;
    }
  `,
  ChartWrap: styled.div`
    width: 100%;
    height: 350px;
    padding: 10px 0;
    margin-top: 10px;
    border: 1px solid ${({ theme }) => theme.colors.lightGray2};
    border-radius: ${({ theme }) => theme.radius.small};

    ${media.xlarge`
    height: 500px;
      `}
  `,

  NoneChart: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: calc(100% - 70px);
    padding: 30px 0 20px;
    background-color: ${({ theme }) => theme.colors.background1};
    border-radius: ${({ theme }) => theme.radius.xsmall};
    margin-top: 20px;
    text-align: center;
  `,

  NoneChartContent: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    p {
      font-size: ${({ theme }) => theme.fontSizes.fz18};
      color: ${({ theme }) => theme.colors.textSecond};

      span {
        font-size: ${({ theme }) => theme.fontSizes.fz20};
        font-weight: ${({ theme }) => theme.fontWeights.bold};
        color: ${({ theme }) => theme.colors.primary};
      }
    }
  `,

  SyncBtnWrap: styled.div`
    display: flex;
    align-items: center;
    width: 70%;
    max-width: 700px;
    padding: 5px;
    margin-top: 50px;
    background-color: #ff0f33;
    border-radius: ${({ theme }) => theme.radius.small};
    cursor: pointer;

    > div {
      width: 50px;
      height: 50px;
      overflow: hidden;

      img {
        width: 100%;
        height: auto;
      }
    }
    p {
      width: 100%;
      font-size: ${({ theme }) => theme.fontSizes.fz18};
      font-weight: ${({ theme }) => theme.fontWeights.medium};
      color: ${({ theme }) => theme.colors.white};
    }
  `,
};
