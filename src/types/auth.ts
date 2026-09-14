export type UserRole = "admin" | "user";

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}
