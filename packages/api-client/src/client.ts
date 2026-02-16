const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  error?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode: number;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

class AuthTokenManager {
  private static token: string | null = null;

  static setToken(token: string | null): void {
    this.token = token;
  }

  static getToken(): string | null {
    return this.token;
  }

  static clearToken(): void {
    this.token = null;
  }
}

async function request<T>(
  method: HttpMethod,
  url: string,
  body?: unknown,
  options?: {
    headers?: Record<string, string>;
    skipAuth?: boolean;
  }
): Promise<ApiResponse<T>> {
  const token = AuthTokenManager.getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  if (!options?.skipAuth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      message: data.message || 'An error occurred',
      code: data.code,
      statusCode: response.status,
    } as ApiError;
  }

  return data as ApiResponse<T>;
}

export const apiClient = {
  get: <T>(url: string, options?: { headers?: Record<string, string>; skipAuth?: boolean }): Promise<ApiResponse<T>> => {
    return request<T>('GET', url, undefined, options);
  },

  post: <T>(
    url: string,
    body: unknown,
    options?: { headers?: Record<string, string>; skipAuth?: boolean }
  ): Promise<ApiResponse<T>> => {
    return request<T>('POST', url, body, options);
  },

  put: <T>(
    url: string,
    body: unknown,
    options?: { headers?: Record<string, string>; skipAuth?: boolean }
  ): Promise<ApiResponse<T>> => {
    return request<T>('PUT', url, body, options);
  },

  patch: <T>(
    url: string,
    body: unknown,
    options?: { headers?: Record<string, string>; skipAuth?: boolean }
  ): Promise<ApiResponse<T>> => {
    return request<T>('PATCH', url, body, options);
  },

  delete: <T>(url: string, options?: { headers?: Record<string, string>; skipAuth?: boolean }): Promise<ApiResponse<T>> => {
    return request<T>('DELETE', url, undefined, options);
  },
};

export const auth = {
  setToken: AuthTokenManager.setToken,
  getToken: AuthTokenManager.getToken,
  clearToken: AuthTokenManager.clearToken,
  isAuthenticated: (): boolean => {
    return AuthTokenManager.getToken() !== null;
  },
};

export { apiClient as default };
