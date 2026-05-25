export type UserRole = 'PO' | 'APO' | 'PMO' | 'CPO' | 'Dev' | 'BA' | 'QA' | 'Developer' | 'Designer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  productIds?: string[];
  trackIds?: string[];
  department?: string;
  isActive?: boolean;
}
