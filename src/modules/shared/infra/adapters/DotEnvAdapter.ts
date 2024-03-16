import 'dotenv/config'

export class DotEnvAdapter {
  static get (key: string): string {
    return process.env[key] ?? ''
  }
}
