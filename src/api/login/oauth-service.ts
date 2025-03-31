import { OAuthProvider } from '@/types/types';

// 로그인 URL 생성
export const getAuthorizationUrl = (
  provider: OAuthProvider,
  state?: string
): string => {
  if (!state) {
    state = crypto.randomUUID() || Math.random().toString(36).substring(2, 15);
  }

  const params = new URLSearchParams({
    client_id: provider.clientId,
    redirect_uri: provider.redirectUri,
    response_type: 'code',
    scope: provider.scope,
    state: state,
  });

  return `${provider.authUrl}?${params.toString()}`;
};
