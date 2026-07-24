import api from './api';

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  quantity: number;
  available: number;
  publishedAt?: string;
  categoryId?: string;
  category?: { id: string; name: string };
  createdAt: string;
}

export interface BooksResponse {
  data: Book[];
  total: number;
  page: number;
  limit: number;
}

export const getBooks = (params?: Record<string, string>) =>
  api.get<BooksResponse>('/books', { params });

export const getBook = (id: string) => api.get<Book>(`/books/${id}`);

export const createBook = (data: Partial<Book>) => api.post<Book>('/books', data);

export const updateBook = (id: string, data: Partial<Book>) => api.put<Book>(`/books/${id}`, data);

export const deleteBook = (id: string) => api.delete(`/books/${id}`);
