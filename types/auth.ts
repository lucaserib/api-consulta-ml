export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  user_id: number;
  refresh_token: string;
}

export interface Tokens {
  access_token: string | null;
  refresh_token: string | null;
  expires_at: number | null;
}
