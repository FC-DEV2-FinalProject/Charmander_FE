import { OAuthProvider } from '@/types/types';

// 로그인 URL 생성
export const getAuthorizationUrl = (
  provider: OAuthProvider,
  state?: string
): string => {
  const params = new URLSearchParams({
    client_id: provider.clientId,
    redirect_uri: provider.redirectUri,
    response_type: 'code',
    scope: provider.scope,
  });

  if (state) {
    params.append('state', state);
  } else {
    state = '';
  }

  return `${provider.authUrl}?${params.toString()}`;
};
