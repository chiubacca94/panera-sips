/// <reference types="vite/client" />

// Google Identity Services (loaded via CDN script in index.html)
interface TokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  error?: never;
}

interface TokenErrorResponse {
  error: string;
  error_description?: string;
}

interface TokenClient {
  requestAccessToken(): void;
}

interface TokenClientConfig {
  client_id: string;
  scope: string;
  callback: (response: TokenResponse | TokenErrorResponse) => void;
}

interface Window {
  google: {
    accounts: {
      oauth2: {
        initTokenClient(config: TokenClientConfig): TokenClient;
        revoke(token: string, callback: () => void): void;
      };
    };
  };
}
