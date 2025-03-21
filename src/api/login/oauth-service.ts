import { OAuthProvider } from '@/types/types';


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
