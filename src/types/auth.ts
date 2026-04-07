export interface UserProfile {
  name: string | null;
  lastname: string | null;
  phoneNumber: string | null;
  phoneVerified: boolean;
  avatarUrl: string | null;
  bio: string | null;
}

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  profile: UserProfile;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshRequest {
  refreshToken: string;
}
