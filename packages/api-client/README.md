# @gate-access/api-client

<p align="center">
  <img src="https://img.shields.io/badge/Status-Stable-brightgreen" alt="Status">
  <img src="https://img.shields.io/badge/Fetch-Native-blue" alt="Fetch">
</p>

Shared API client with JWT authentication for GateFlow applications.

## Installation

```bash
# Auto-installed by pnpm workspace
# No manual installation needed
```

## Usage

```typescript
import apiClient, {
  auth,
  ApiResponse,
  ApiError,
} from '@gate-access/api-client';

// Set auth token (after login)
auth.setToken('your-jwt-token');

// Make API requests
const response = await apiClient.get<User[]>('/users');
const createResult = await apiClient.post<QRCode>('/qrcodes', {
  type: 'SINGLE',
  gateId: 'gate_123',
});

// Check auth status
if (auth.isAuthenticated()) {
  // Do something
}

// Clear auth (on logout)
auth.clearToken();
```

## Exports

### Default Export

- `apiClient` — Main API client instance

### Named Exports

| Export           | Type      | Description                                        |
| ---------------- | --------- | -------------------------------------------------- |
| `apiClient`      | Object    | HTTP client with get/post/put/patch/delete methods |
| `auth`           | Object    | Auth token manager                                 |
| `ApiResponse<T>` | Interface | Generic API response wrapper                       |
| `ApiError`       | Interface | API error structure                                |

## API Client Methods

Each method returns a `Promise<ApiResponse<T>>`:

```typescript
apiClient.get<T>(url, options?)
apiClient.post<T>(url, body, options?)
apiClient.put<T>(url, body, options?)
apiClient.patch<T>(url, body, options?)
apiClient.delete<T>(url, options?)
```

### Options

| Option     | Type                     | Description                             |
| ---------- | ------------------------ | --------------------------------------- |
| `headers`  | `Record<string, string>` | Custom headers                          |
| `skipAuth` | `boolean`                | Skip auth header (for public endpoints) |

## Auth Manager

| Method                   | Description           |
| ------------------------ | --------------------- |
| `auth.setToken(token)`   | Set JWT token         |
| `auth.getToken()`        | Get current token     |
| `auth.clearToken()`      | Clear token (logout)  |
| `auth.isAuthenticated()` | Check if token exists |

## Response Types

```typescript
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  error?: string;
}

interface ApiError {
  message: string;
  code?: string;
  statusCode: number;
}
```

## Environment Variables

The client uses `NEXT_PUBLIC_API_URL` for the base URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Default: `http://localhost:3000/api`

## Error Handling

```typescript
try {
  const response = await apiClient.get<User>('/users');
  if (response.success) {
    console.log(response.data);
  }
} catch (error) {
  if (error.statusCode === 401) {
    // Handle unauthorized
  } else if (error.statusCode === 403) {
    // Handle forbidden
  }
}
```

## Dependencies

- `react` — React library (for conditional hooks if needed)

## Related Documentation

- [Security Overview](../../docs/guides/SECURITY_OVERVIEW.md)
- [Environment Variables](../../docs/guides/ENVIRONMENT_VARIABLES.md)
- [CLAUDE.md: Authentication](../../CLAUDE.md#authentication--security)
