import { type ConnectionInterface, EmailValueObject, IdValueObject, NameValueObject, PgPromiseAdapter, TaxIdValueObject } from '@modules/shared'
import { UserEntity, UserRepository } from '@modules/user'

describe('UserRepository Integration Tests', () => {
  let connection: ConnectionInterface
  let userRepository: UserRepository

  beforeEach(() => {
    connection = new PgPromiseAdapter()
    userRepository = new UserRepository(connection)
  })

  afterAll(async () => {
    await connection.query('DELETE FROM keycloak.users')
    await connection.close()
  })

  it('should be get a user', async () => {
    const userEntity = new UserEntity({
      id: new IdValueObject('83e032fc-e3e8-4b28-893d-a315c6a0f977'),
      name: new NameValueObject('John Doe'),
      email: new EmailValueObject('johndoe@email.com'),
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
    await expect(userRepository.find('cb448d8d-4e08-480a-bf4a-1ed640870aeb')).rejects.toThrow('user_not_found')
  })

  it('should be create a user', async () => {
    const userEntity = new UserEntity({
      id: new IdValueObject('e935b023-a6b3-4a6d-8827-eb5970e502ac'),
      name: new NameValueObject('Jane Doe'),
      email: new EmailValueObject('janedoe@email.com'),
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
      id: new IdValueObject('0a0b9da8-f2ca-4317-b72c-14632ce14389'),
      name: new NameValueObject('Charli Doe'),
      email: new EmailValueObject('charlidoe@email.com'),
      taxId: new TaxIdValueObject('71428793860')
    })
    await userRepository.save(userEntity)
    const userUpdated = {
      id: new IdValueObject(userEntity.id.value),
      name: new NameValueObject('Charlie Doe'),
      email: new EmailValueObject('charliedoe@email.com'),
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
