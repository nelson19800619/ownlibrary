import api from './api';

export interface Article {
  id: string;
  title: string;
  author: string;
  journal?: string;
  doi?: string;
  description?: string;
  publishedAt?: string;
  categoryId?: string;
  category?: { id: string; name: string };
  createdAt: string;
}

export interface ArticlesResponse {
  data: Article[];
  total: number;
  page: number;
  limit: number;
}

export const getArticles = (params?: Record<string, string>) =>
  api.get<ArticlesResponse>('/articles', { params });

export const getArticle = (id: string) => api.get<Article>(`/articles/${id}`);

export const createArticle = (data: Partial<Article>) => api.post<Article>('/articles', data);

export const updateArticle = (id: string, data: Partial<Article>) =>
  api.put<Article>(`/articles/${id}`, data);

export const deleteArticle = (id: string) => api.delete(`/articles/${id}`);
