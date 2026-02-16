import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export const client = {
  get: <T>(url: string) => apiClient.get<ApiResponse<T>>(url),
  post: <T>(url: string, data: unknown) => apiClient.post<ApiResponse<T>>(url, data),
  put: <T>(url: string, data: unknown) => apiClient.put<ApiResponse<T>>(url, data),
  delete: <T>(url: string) => apiClient.delete<ApiResponse<T>>(url),
};

export default apiClient;
