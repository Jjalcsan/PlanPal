export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

async function request<T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

function buildPath(base: string, id?: string): string {
  return id ? `${base}/${id}` : base;
}

export function createService<T, CreateDTO, UpdateDTO>(basePath: string) {
  return {
    getAll: () => request<ApiResponse<T[]>>("GET", basePath),

    getById: (id: string) =>
      request<ApiResponse<T>>("GET", buildPath(basePath, id)),

    create: (dto: CreateDTO) =>
      request<ApiResponse<T>>("POST", basePath, dto),

    update: (id: string, dto: UpdateDTO) =>
      request<ApiResponse<T>>("PATCH", buildPath(basePath, id), dto),

    delete: (id: string) =>
      request<void>("DELETE", buildPath(basePath, id)),
  };
}
