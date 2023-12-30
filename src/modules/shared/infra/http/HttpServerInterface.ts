export interface HttpServerInterface {
  on: (method: string, path: string, callback: Function) => void
  listen: (port: number) => void
}
