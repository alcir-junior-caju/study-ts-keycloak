import { type UserEntity } from '../domain'

export interface UserGatewayInterface {
  save: (user: UserEntity) => Promise<UserEntity>
  update: (user: UserEntity) => Promise<UserEntity>
  find: (id: string) => Promise<UserEntity>
}
