// Unified API base helpers
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : 'https://unijoy.onrender.com');

export type ApiOptions = RequestInit & {
  token?: string;
  signal?: AbortSignal;
  onError?: (error: Error) => void;
};

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
        message = await res.text();
      } catch {}
      const err = new Error(message || 'Request failed');
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
    const err = e instanceof Error ? e : new Error('Network error');
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
