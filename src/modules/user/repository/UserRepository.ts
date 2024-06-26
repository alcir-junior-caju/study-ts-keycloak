import { type ConnectionInterface, EmailValueObject, IdValueObject, NameValueObject, TaxIdValueObject } from '@modules/shared'

import { type UserRepositoryInterface } from '../application'
import { UserEntity } from '../domain'

export class UserRepository implements UserRepositoryInterface {
  connection: ConnectionInterface

  constructor (connection: ConnectionInterface) {
    this.connection = connection
  }

  async save (user: UserEntity): Promise<void> {
    await this.connection.query('INSERT INTO keycloak.users (id, name, email, tax_id) VALUES ($1, $2, $3, $4)', [user.id.value, user.name.value, user.email.value, user.taxId.value])
  }

  async update (user: UserEntity): Promise<void> {
    await this.connection.query('UPDATE keycloak.users SET name = $1, email = $2, tax_id = $3 WHERE id = $4', [user.name.value, user.email.value, user.taxId.value, user.id.value])
  }

  async find (id: string): Promise<UserEntity> {
    const [userData] = await this.connection.query('SELECT * FROM keycloak.users WHERE id = $1', [id])
    if (!userData) throw new Error('user_not_found')
    const userEntity = new UserEntity({
      id: new IdValueObject(String(userData.id)),
      name: new NameValueObject(userData.name),
      email: new EmailValueObject(userData.email),
      taxId: new TaxIdValueObject(userData.tax_id),
      createdAt: userData.created_at,
      updatedAt: userData.updated_at
    })
    return userEntity
  }

  async delete (id: string): Promise<void> {
    await this.connection.query('DELETE FROM keycloak.users WHERE id = $1', [id])
  }
}
