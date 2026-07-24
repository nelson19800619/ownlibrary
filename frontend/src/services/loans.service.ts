import api from './api';

export interface Loan {
  id: string;
  userId: string;
  bookId: string;
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
  loanedAt: string;
  dueDate: string;
  returnedAt?: string;
  user?: { id: string; name: string; email: string };
  book?: { id: string; title: string; author: string };
}

export interface LoansResponse {
  data: Loan[];
  total: number;
  page: number;
  limit: number;
}

export const getLoans = (params?: Record<string, string>) =>
  api.get<LoansResponse>('/loans', { params });

export const createLoan = (data: { bookId: string; dueDate: string; userId?: string }) =>
  api.post<Loan>('/loans', data);

export const returnLoan = (id: string) => api.put<Loan>(`/loans/${id}/return`);
