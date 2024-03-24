export interface HttpServerInterface {
  on: (
    route: Record<any, any>,
    middleware: Function,
    callback: Function,
  ) => void
  listen: (port: number) => void
}
