export interface HttpClientInterface {
  get: (url: string) => Promise<any>
  post: (url: string, body: any) => Promise<any>
  patch: (url: string, body: any) => Promise<any>
}
