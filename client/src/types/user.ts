// Enterprise Mall - User Type Definitions

export interface User {
  id: number;
  employeeId: string;
  username: string;
  role: 'EMPLOYEE' | 'ADMIN';
  department: string | null;
  points: number;
  avatarUrl: string | null;
  address: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface PointRecord {
  id: number;
  userId: number;
  type: 'GRANT' | 'CONSUME' | 'REFUND' | 'ADJUST';
  points: number;
  balance: number;
  reason: string | null;
  orderId: number | null;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
