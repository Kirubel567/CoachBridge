export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: Boolean;
}

export interface SignupRequest {
  first_name?: string;
  business_name?: string;
  last_name?: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
  role: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

