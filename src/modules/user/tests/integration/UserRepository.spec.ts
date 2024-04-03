import { type ConnectionInterface, EmailValueObject, IdValueObject, NameValueObject, PgPromiseAdapter, TaxIdValueObject } from '@modules/shared'
import { UserEntity, UserRepository } from '@modules/user'
import { Chance } from 'chance'

const chance = new Chance()

describe('UserRepository Integration Tests', () => {
  let connection: ConnectionInterface
  let userRepository: UserRepository

  beforeEach(() => {
    connection = new PgPromiseAdapter()
    userRepository = new UserRepository(connection)
  })

  afterEach(async () => {
    await connection.query('TRUNCATE keycloak.users')
    await connection.close()
  })

  it('should be get a user', async () => {
    const userEntity = new UserEntity({
      id: new IdValueObject(chance.guid()),
      name: new NameValueObject(chance.name()),
      email: new EmailValueObject(chance.email()),
      taxId: new TaxIdValueObject(chance.cpf({ formatted: false }))
    })
    await userRepository.save(userEntity)
    const output = await userRepository.find(userEntity.id.value)
    expect(output.id.value).toBe(userEntity.id.value)
    expect(output.name.value).toBe(userEntity.name.value)
    expect(output.email.value).toBe(userEntity.email.value)
    expect(output.taxId.value).toBe(userEntity.taxId.value)
  })

  it('should be throw error when user not found', async () => {
    await expect(userRepository.find(chance.guid())).rejects.toThrow('user_not_found')
  })

  it('should be create a user', async () => {
    const userEntity = new UserEntity({
      id: new IdValueObject(chance.guid()),
      name: new NameValueObject(chance.name()),
      email: new EmailValueObject(chance.email()),
      taxId: new TaxIdValueObject(chance.cpf({ formatted: false }))
    })
    await userRepository.save(userEntity)
    const output = await userRepository.find(userEntity.id.value)
    expect(output.id.value).toBe(userEntity.id.value)
    expect(output.name.value).toBe(userEntity.name.value)
    expect(output.email.value).toBe(userEntity.email.value)
    expect(output.taxId.value).toBe(userEntity.taxId.value)
  })

  it('should be update a user', async () => {
    const userEntity = new UserEntity({
      id: new IdValueObject(chance.guid()),
      name: new NameValueObject(chance.name()),
      email: new EmailValueObject(chance.email()),
      taxId: new TaxIdValueObject(chance.cpf({ formatted: false }))
    })
    await userRepository.save(userEntity)
    const userUpdated = {
      id: new IdValueObject(userEntity.id.value),
      name: new NameValueObject(chance.name()),
      email: new EmailValueObject(chance.email()),
      taxId: new TaxIdValueObject(chance.cpf({ formatted: false }))
    }
    const userUpdatedEntity = new UserEntity(userUpdated)
    await userRepository.update(userUpdatedEntity)
    const output = await userRepository.find(userEntity.id.value)
    expect(output.id.value).toBe(userUpdatedEntity.id.value)
    expect(output.name.value).toBe(userUpdatedEntity.name.value)
    expect(output.email.value).toBe(userUpdatedEntity.email.value)
    expect(output.taxId.value).toBe(userUpdatedEntity.taxId.value)
  })
})
