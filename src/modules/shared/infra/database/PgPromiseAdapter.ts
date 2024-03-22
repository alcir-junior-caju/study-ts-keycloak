import pgp from 'pg-promise'

import { DotEnvAdapter } from '../adapters'

import { type ConnectionInterface } from './ConnectionInterface'

const databaseUrl = `${DotEnvAdapter.get('DATABASE_CLIENT')}://${DotEnvAdapter.get('DATABASE_USERNAME')}:${DotEnvAdapter.get('DATABASE_PASSWORD')}@${DotEnvAdapter.get('DATABASE_HOST')}:${DotEnvAdapter.get('DATABASE_PORT')}/${DotEnvAdapter.get('DATABASE_NAME')}`

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
