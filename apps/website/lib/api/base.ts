// Unified API base helpers
const REAL_BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : 'https://unijoy.onrender.com');

// In the browser, go through Next.js rewrites (same-origin) to avoid CORS.
// On the server, call the backend directly.
export const API_BASE_URL =
  typeof window === 'undefined' ? REAL_BACKEND_BASE_URL : '/api/backend';

export type ApiOptions = RequestInit & {
  token?: string;
  signal?: AbortSignal;
  onError?: (error: Error) => void;
};

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function extractBackendMessage(text: string): string {
  const trimmed = (text || '').trim();
  if (!trimmed) return 'Request failed';

  const looksLikeJson = trimmed.startsWith('{') || trimmed.startsWith('[');
  if (!looksLikeJson) return trimmed;

  try {
    const parsed: any = JSON.parse(trimmed);

    if (typeof parsed === 'string') return parsed;

    if (parsed?.message && typeof parsed.message === 'string') {
      return parsed.message;
    }

    if (Array.isArray(parsed?.data) && parsed.data.length > 0) {
      const msgs = parsed.data
        .map((e: any) => e?.msg)
        .filter(Boolean)
        .map(String);
      if (msgs.length) return msgs.join('\n');
    }

    if (parsed?.error && typeof parsed.error === 'string') return parsed.error;
    if (parsed?.errors && typeof parsed.errors === 'string')
      return parsed.errors;

    return trimmed;
  } catch {
    return trimmed;
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  const { token, headers, signal, onError, ...rest } = options;
  const url = `${API_BASE_URL}${endpoint}`;
  const isFormData =
    typeof FormData !== 'undefined' && (rest as any)?.body instanceof FormData;

  const finalHeaders: HeadersInit = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers || {}),
  };

  if (!isFormData) {
    if (!(finalHeaders as any)['Content-Type']) {
      (finalHeaders as any)['Content-Type'] = 'application/json';
    }
  }

  const config: RequestInit = {
    headers: finalHeaders,
    cache: 'no-store',
    signal,
    ...rest,
  };
  try {
    const res = await fetch(url, config);
    if (!res.ok) {
      let message = res.statusText;
      try {
        const text = await res.text();
        if (text.includes('<!DOCTYPE html>')) {
          message = `Server error: ${res.status} ${res.statusText}`;
        } else {
          message = extractBackendMessage(text);
        }
      } catch {}
      const err = new ApiError(message || 'Request failed', res.status);
      onError?.(err);
      throw err;
    }
    // Some endpoints may return empty body
    try {
      return (await res.json()) as T;
    } catch {
      return undefined as unknown as T;
    }
  } catch (e: any) {
    const err =
      e instanceof ApiError
        ? e
        : e instanceof Error
          ? new ApiError(e.message || 'Network error', 0)
          : new ApiError('Network error', 0);
    onError?.(err);
    throw err;
  }
}

export async function apiMultipart<T = any>(
  endpoint: string,
  formData: FormData,
  options: ApiOptions = {},
) {
  // Intentionally do not set Content-Type so browser sets proper boundary
  const { token, headers, signal, ...rest } = options;
  return apiRequest<T>(endpoint, {
    method: rest.method || 'POST',
    body: formData as any,
    token,
    signal,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    // Remove json content-type if present
  } as any);
}

export const get = <T = any>(endpoint: string, options?: ApiOptions) =>
  apiRequest<T>(endpoint, { ...(options || {}), method: 'GET' });
export const post = <T = any>(
  endpoint: string,
  body?: any,
  options?: ApiOptions,
) =>
  apiRequest<T>(endpoint, {
    ...(options || {}),
    method: 'POST',
    body: JSON.stringify(body),
  });
export const put = <T = any>(
  endpoint: string,
  body?: any,
  options?: ApiOptions,
) =>
  apiRequest<T>(endpoint, {
    ...(options || {}),
    method: 'PUT',
    body: JSON.stringify(body),
  });
export const del = <T = any>(endpoint: string, options?: ApiOptions) =>
  apiRequest<T>(endpoint, { ...(options || {}), method: 'DELETE' });
