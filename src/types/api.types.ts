export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  meta?: PaginationMeta;
}
