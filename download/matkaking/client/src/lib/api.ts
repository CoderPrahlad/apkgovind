const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getHealth(): Promise<{ status: string; timestamp: string }> {
  return apiFetch('/api/health');
}

export async function getUsers(): Promise<any[]> {
  return apiFetch('/api/users');
}

export async function createUser(data: { email: string; name?: string }): Promise<any> {
  return apiFetch('/api/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getPosts(): Promise<any[]> {
  return apiFetch('/api/posts');
}

export async function createPost(data: { title: string; content?: string; authorId: string }): Promise<any> {
  return apiFetch('/api/posts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
