/* eslint-disable no-console */
import axios from 'axios';
import { OAuthProvider, OAuthToken, UserProfile } from '@/types/types';

// 로그인 URL 생성
export const getAuthorizationUrl = (provider: OAuthProvider): string => {
  const params = new URLSearchParams({
    client_id: provider.clientId,
    redirect_uri: provider.redirectUri,
    response_type: 'code',
    scope: provider.scope,
  });

  return `${provider.authUrl}?${params.toString()}`;
};

// 인증 코드로 토큰 요청
export const getToken = async (
  code: string,
  provider: OAuthProvider
): Promise<OAuthToken> => {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: provider.clientId,
    redirect_uri: provider.redirectUri,
    code,
  });

  // 구글은 client_secret이 필요합니다
  if (provider.clientSecret) {
    params.append('client_secret', provider.clientSecret);
  }

  try {
    const response = await axios.post(provider.tokenUrl, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    console.error('토큰 요청 오류:', error);
    throw new Error('토큰 요청 중 오류가 발생했습니다.');
  }
};

// 카카오 사용자 프로필 가져오기
export const getKakaoUserProfile = async (
  token: OAuthToken
): Promise<UserProfile> => {
  try {
    const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });

    const { id, kakao_account } = response.data;
    return {
      id: id.toString(),
      email: kakao_account?.email,
      name: kakao_account?.profile?.nickname,
      picture: kakao_account?.profile?.profile_image_url,
      provider: 'kakao',
    };
  } catch (error) {
    console.error('카카오 프로필 요청 오류:', error);
    throw new Error('카카오 프로필 정보를 가져오는 중 오류가 발생했습니다.');
  }
};

export const getGoogleUserProfile = async (
  token: OAuthToken
): Promise<UserProfile> => {
  try {
    const response = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      }
    );

    const { id, email, name, picture } = response.data;
    return {
      id,
      email,
      name,
      picture,
      provider: 'google',
    };
  } catch (error) {
    console.error('구글 프로필 요청 오류:', error);
    throw new Error('구글 프로필 정보를 가져오는 중 오류가 발생했습니다.');
  }
};

export const getYoutubeChannelInfo = async (
  token: OAuthToken
): Promise<UserProfile> => {
  try {
    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/channels',
      {
        params: {
          part: 'snippet',
          mine: true,
        },
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      }
    );

    const channel = response.data.items[0];
    return {
      id: channel.id,
      name: channel.snippet.title,
      picture: channel.snippet.thumbnails.default.url,
      provider: 'youtube',
    };
  } catch (error) {
    console.error('유튜브 채널 정보 요청 오류:', error);
    throw new Error('유튜브 채널 정보를 가져오는 중 오류가 발생했습니다.');
  }
};
