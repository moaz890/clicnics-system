export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse extends AuthTokens {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface LoginResponse extends AuthTokens {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface RefreshTokenResponse extends AuthTokens {}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role?: string;
}
