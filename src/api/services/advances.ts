import { api } from '../client';

interface AdvancePayment {
  id: string; employee_id: string; amount: number; month: number;
  year: number; status: 'pending' | 'paid'; notes: string;
  requested_at: string; created_at: string; updated_at: string;
}

interface RepayableLoan {
  id: string; employee_id: string; amount: number;
  total_installments: number; remaining_installments: number;
  status: 'active' | 'paid'; notes: string;
  requested_at: string; created_at: string; updated_at: string;
}

interface SocialFundRequest {
  id: string; employee_id: string; amount: number; reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid'; notes: string;
  requested_at: string; created_at: string; updated_at: string;
}

const PAYMENTS = '/advances/payments';
const LOANS = '/advances/loans';
const SOCIAL_FUND = '/advances/social-fund';

export const advancesApi = {
  payments: {
    list: (params?: { employee_id?: string; month?: number; year?: number }) =>
      api.getList<AdvancePayment>(PAYMENTS, params),
    getById: (id: string) => api.get<AdvancePayment>(`${PAYMENTS}/${id}`),
    create: (body: Omit<AdvancePayment, 'id' | 'requested_at' | 'created_at' | 'updated_at'>) =>
      api.post<AdvancePayment>(PAYMENTS, body),
    update: (id: string, body: Partial<AdvancePayment>) =>
      api.patch<AdvancePayment>(PAYMENTS, id, body),
    delete: (id: string) => api.delete(PAYMENTS, id),
  },
  loans: {
    list: (params?: { employee_id?: string }) =>
      api.getList<RepayableLoan>(LOANS, params),
    getById: (id: string) => api.get<RepayableLoan>(`${LOANS}/${id}`),
    create: (body: Omit<RepayableLoan, 'id' | 'requested_at' | 'created_at' | 'updated_at'>) =>
      api.post<RepayableLoan>(LOANS, body),
    update: (id: string, body: Partial<RepayableLoan>) =>
      api.patch<RepayableLoan>(LOANS, id, body),
    delete: (id: string) => api.delete(LOANS, id),
  },
  socialFund: {
    list: (params?: { employee_id?: string }) =>
      api.getList<SocialFundRequest>(SOCIAL_FUND, params),
    getById: (id: string) => api.get<SocialFundRequest>(`${SOCIAL_FUND}/${id}`),
    create: (body: Omit<SocialFundRequest, 'id' | 'requested_at' | 'created_at' | 'updated_at'>) =>
      api.post<SocialFundRequest>(SOCIAL_FUND, body),
    update: (id: string, body: Partial<SocialFundRequest>) =>
      api.patch<SocialFundRequest>(SOCIAL_FUND, id, body),
    delete: (id: string) => api.delete(SOCIAL_FUND, id),
  },
};
