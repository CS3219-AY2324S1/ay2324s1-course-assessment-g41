export interface RefreshToken {
  id: string;
  user_id: string;
  revoked: boolean;
  expiry: number;
}

export default RefreshToken;
