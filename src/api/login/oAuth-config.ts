import { OAuthProvider } from '@/types/types';

export const kakaoOAuth: OAuthProvider = {
  name: 'kakao',
  authUrl: 'https://kauth.kakao.com/oauth/authorize',
  tokenUrl: 'https://kauth.kakao.com/oauth/token',
  clientId: import.meta.env.VITE_KAKAO_REST_API, // REST API 키
  redirectUri: import.meta.env.VITE_CALLBACK_URL + '/auth/callback/kakao',
  scope: 'profile_nickname profile_image account_email',
};

export const googleOAuth: OAuthProvider = {
  name: 'google',
  authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
  redirectUri: import.meta.env.VITE_CALLBACK_URL + '/auth/callback/google',
  scope: 'email profile',
};

export const youtubeOAuth: OAuthProvider = {
  name: 'youtube',
  authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  clientId: import.meta.env.VITE_YOUTUBE_CLIENT_ID,
  clientSecret: import.meta.env.VITE_CLIENT_SECRET,
  redirectUri: import.meta.env.VITE_CALLBACK_URL + '/youtube',
  scope:
    'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload',
};
