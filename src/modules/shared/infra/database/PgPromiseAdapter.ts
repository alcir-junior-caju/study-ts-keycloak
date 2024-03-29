import pgp from 'pg-promise'

import { DotEnvAdapter } from '../adapters'

import { type ConnectionInterface } from './ConnectionInterface'

const config = {
  client: DotEnvAdapter.get('DATABASE_CLIENT'),
  host: DotEnvAdapter.get('DATABASE_HOST'),
  port: DotEnvAdapter.get('DATABASE_PORT'),
  database: DotEnvAdapter.get('DATABASE_NAME'),
  user: DotEnvAdapter.get('DATABASE_USERNAME'),
  password: DotEnvAdapter.get('DATABASE_PASSWORD')
}

const databaseUrl = `${config.client}://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`

export class PgPromiseAdapter implements ConnectionInterface {
  connection: any

  constructor () {
    this.connection = pgp()(databaseUrl)
  }

  async query (statement: string, params?: any): Promise<any> {
    return this.connection.query(statement, params)
  }

  async close (): Promise<void> {
    await this.connection.$pool.end()
  }
}
