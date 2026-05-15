

export interface ApiRequestOptions extends RequestInit {
  requireAuth?: boolean;
}


export interface DataResult<T = string> {
  data?: T
  msg?: string
  status: number
}
