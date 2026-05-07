export interface MockTest {
  id: string;
  name: string;
  category: 'AUTH' | 'USER_CRUD' | 'RBAC' | 'JWT';
  description: string;
  status: 'IDLE' | 'RUNNING' | 'PASSED' | 'FAILED';
  errorMessage?: string;
  assertions: string[];
}