import api from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'LIBRARIAN' | 'READER';
  createdAt: string;
}

export interface UsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
}

export const getUsers = (params?: Record<string, string>) =>
  api.get<UsersResponse>('/users', { params });

export const updateUser = (id: string, data: Partial<User & { password: string }>) =>
  api.put<User>(`/users/${id}`, data);

export const deleteUser = (id: string) => api.delete(`/users/${id}`);
