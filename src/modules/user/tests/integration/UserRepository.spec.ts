import { type ConnectionInterface, EmailValueObject, IdValueObject, NameValueObject, PgPromiseAdapter, TaxIdValueObject } from '@modules/shared'
import { UserEntity, UserRepository } from '@modules/user'

const userStub = {
  name: new NameValueObject('John Doe'),
  email: new EmailValueObject('johndoe@rmail.com')
}

describe('UserRepository Integration Tests', () => {
  let connection: ConnectionInterface
  let userRepository: UserRepository

  beforeEach(() => {
    connection = new PgPromiseAdapter()
    userRepository = new UserRepository(connection)
  })

  afterEach(async () => {
    await connection.query('DELETE FROM keycloak.users')
    await connection.close()
  })

  it('should be get a user', async () => {
    const userEntity = new UserEntity({
      ...userStub,
      taxId: new TaxIdValueObject('34866916001')
    })
    await userRepository.save(userEntity)
    const output = await userRepository.find(userEntity.id.value)
    expect(output.id.value).toBe(userEntity.id.value)
    expect(output.name.value).toBe(userEntity.name.value)
    expect(output.email.value).toBe(userEntity.email.value)
    expect(output.taxId.value).toBe(userEntity.taxId.value)
  })

  it('should be throw error when user not found', async () => {
    await expect(userRepository.find('e9de5d53-1dae-4f28-ac7c-9a762164ba98')).rejects.toThrow('user_not_found')
  })

  it('should be create a user', async () => {
    const userEntity = new UserEntity({
      ...userStub,
      taxId: new TaxIdValueObject('74445721000')
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
      ...userStub,
      taxId: new TaxIdValueObject('71428793860')
    })
    await userRepository.save(userEntity)
    const userUpdated = {
      id: new IdValueObject(userEntity.id.value),
      name: new NameValueObject('Jane Doe'),
      email: new EmailValueObject('janedoe@email.com'),
      taxId: new TaxIdValueObject('87748248800')
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
