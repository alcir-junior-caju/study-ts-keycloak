export interface HttpServerInterface {
  on: (
    route: Record<any, any>,
    callback: Function,
  ) => void
  listen: (port: number) => void
}
