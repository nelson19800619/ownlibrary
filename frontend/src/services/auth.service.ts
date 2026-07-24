import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://web-production-18137.up.railway.app';

const authApi = axios.create({ baseURL: API_URL });

export const login = (username: string, password: string, client_id: string, client_secret: string) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  params.append('client_id', client_id);
  params.append('client_secret', client_secret);
  return authApi.post('/usuarios/login', params);
};

export const registro = (nombre: string, email: string, password: string) =>
  authApi.post('/usuarios/registro', { nombre, email, password });

export const miPerfil = () => authApi.get('/usuarios/yo');
