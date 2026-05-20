export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetCodeRequest {
  email: string;
  code: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse extends AuthTokens {
  user: AuthUser;
}

export interface LoginResponse extends AuthTokens {
  user: AuthUser;
}

export interface RefreshTokenResponse extends AuthTokens {}

export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  role?: string;
}
