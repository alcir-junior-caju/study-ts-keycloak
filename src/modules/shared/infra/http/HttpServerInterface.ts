export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface HttpServerInterface {
  on: (
    method: HttpMethod,
    path: string,
    middleware: Function,
    callback: Function,
  ) => void
  listen: (port: number) => void
}
