import axios from 'axios';

const authApi = axios.create({ baseURL: '/auth' });

export const login = (email: string, password: string) =>
  authApi.post<{ token: string; user: { id: string; name: string; email: string; role: string } }>(
    '/login',
    { email, password }
  );

export const register = (data: { name: string; email: string; password: string; role?: string }) =>
  authApi.post('/register', data);

export const getMe = (token: string) =>
  authApi.get<{ id: string; name: string; email: string; role: string }>('/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
