import { AxiosAdapter, EmailValueObject, IdValueObject, NameValueObject, PgPromiseAdapter, TaxIdValueObject } from '@modules/shared'
import { UserEntity } from '@modules/user/domain'
import { UserRepository } from '@modules/user/repository'
import { Chance } from 'chance'

const chance = new Chance()
const idString = chance.guid()
const nameString = chance.name()
const emailString = chance.email()
const taxIdString = chance.cpf({ formatted: false })
const nameChangedString = chance.name()
const emailChangedString = chance.email()
const taxIdChangedString = chance.cpf({ formatted: false })

describe('UserApi Integration Tests', () => {
  let connection: PgPromiseAdapter
  let userRepository: UserRepository

  beforeEach(async () => {
    connection = new PgPromiseAdapter()
    userRepository = new UserRepository(connection)
  })

  afterEach(async () => {
    await connection.query('TRUNCATE keycloak.users')
    await connection.close()
  })

  it('should update user api', async () => {
    const httpClient = new AxiosAdapter()
    const entity = new UserEntity({
      id: new IdValueObject(idString),
      name: new NameValueObject(nameString),
      email: new EmailValueObject(emailString),
      taxId: new TaxIdValueObject(taxIdString)
    })
    await userRepository.save(entity)
    const input = {
      name: nameChangedString,
      email: emailChangedString,
      taxId: taxIdChangedString
    }
    const response = await httpClient.patch(
      `http://127.0.0.1:8888/users/${entity.id.value}`,
      input
    )
    const { data } = response
    expect(response.status).toBe(200)
    expect(data).toEqual({
      id: entity.id.value,
      name: input.name,
      email: input.email,
      taxId: input.taxId,
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    })
  })

  it('should get user api', async () => {
    const httpClient = new AxiosAdapter()
    const entity = new UserEntity({
      id: new IdValueObject(idString),
      name: new NameValueObject(nameString),
      email: new EmailValueObject(emailString),
      taxId: new TaxIdValueObject(taxIdString)
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
