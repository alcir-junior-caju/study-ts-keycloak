import { AxiosAdapter, EmailValueObject, IdValueObject, NameValueObject, PgPromiseAdapter, TaxIdValueObject } from '@modules/shared'
import { UserEntity } from '@modules/user/domain'
import { UserRepository } from '@modules/user/repository'

const idString = 'd290f1ee-6c54-4b01-90e6-d701748f0851'

describe('UserApi Integration Tests', () => {
  let connection: PgPromiseAdapter
  let userRepository: UserRepository

  beforeEach(async () => {
    connection = new PgPromiseAdapter()
    userRepository = new UserRepository(connection)
  })

  afterEach(async () => {
    await connection.query('DELETE FROM keycloak.users')
    await connection.close()
  })

  // it.skip('should update user api', async () => {
  //   const httpClient = new AxiosAdapter()
  //   const entity = new UserEntity({
  //     name: new NameValueObject('John Doe'),
  //     email: new EmailValueObject(`${Date.now()}@update.com`),
  //     taxId: new TaxIdValueObject('97456321558')
  //   })
  //   await userRepository.save(entity)
  //   const input = {
  //     name: 'Jane Doe',
  //     email: `${Date.now()}@update.com`,
  //     taxId: '48894838021'
  //   }
  //   const response = await httpClient.patch(
  //     `http://127.0.0.1:8888/users/${entity.id.value}`,
  //     input
  //   )
  //   const { createdAt, updatedAt, ...output } = response.data
  //   expect(response.status).toBe(200)
  //   expect(output).toEqual({
  //     id: entity.id.value,
  //     name: input.name,
  //     email: input.email,
  //     taxId: input.taxId
  //   })
  // })

  it('should get user api', async () => {
    const httpClient = new AxiosAdapter()
    const entity = new UserEntity({
      id: new IdValueObject(idString),
      name: new NameValueObject('John Doe'),
      email: new EmailValueObject(`${Date.now()}@get.com`),
      taxId: new TaxIdValueObject('97456321558')
    })
    await userRepository.save(entity)
    const response = await httpClient.get(`http://127.0.0.1:8888/users/${entity.id.value}`)
    expect(response.status).toBe(200)
    expect(response.data).toEqual({
      id: entity.id.value,
      name: entity.name.value,
      email: entity.email.value,
      taxId: entity.taxId.value,
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    })
  })
})
