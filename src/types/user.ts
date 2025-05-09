
export type UserRole = 'admin' | 'operador' | 'supervisor';
export type UserStatus = 'activo' | 'inactivo';

export interface User {
  id: string;
  email: string;
  password: string; // This should be hashed, never stored in plain text
  name: string;
  phone: string;
  role: UserRole;
  createdAt: Date;
  status: UserStatus;
}
