// src/auth/types/auth-user.type.ts
export interface AuthUser {
  id: number;
  email: string;
  name: string;
  avatar?: string | null;
}
