import { AxiosAdapter, EmailValueObject, NameValueObject, PgPromiseAdapter, TaxIdValueObject } from '@modules/shared'
import { UserEntity } from '@modules/user/domain'
import { UserRepository } from '@modules/user/repository'

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

  it('should persist user api', async () => {
    const httpClient = new AxiosAdapter()
    const input = {
      name: 'John Doe',
      email: `${Date.now()}@create.com`,
      taxId: '97456321558'
    }
    const response = await httpClient.post('http://127.0.0.1:8888/users', input)

    expect(response.status).toBe(200)
    expect(response.data).toEqual({
      id: expect.any(String),
      name: input.name,
      email: input.email,
      taxId: input.taxId,
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    })
  })

  const email = Math.random() * 21
  const userInputRequiredFields = [
    {
      input: {
        name: 'John Doe',
        email: `${email}@required.com`
      },
      expected: {
        success: false,
        errorName: 'ZodError',
        issuePath: 'taxId',
        issueMessage: 'Required'
      }
    },
    {
      input: {
        name: 'John Doe',
        taxId: '97456321558'
      },
      expected: {
        success: false,
        errorName: 'ZodError',
        issuePath: 'email',
        issueMessage: 'Required'
      }
    },
    {
      input: {
        email: `${email}@required.com`,
        taxId: '97456321558'
      },
      expected: {
        success: false,
        errorName: 'ZodError',
        issuePath: 'name',
        issueMessage: 'Required'
      }
    },
    {
      input: {
        name: 'J',
        taxId: '97456321558',
        email: `${email}@required.com`
      },
      expected: {
        success: false,
        errorName: 'ZodError',
        issuePath: 'name',
        issueMessage: 'String must contain at least 3 character(s)'
      }
    },
    {
      input: {
        name: 'John Doe',
        taxId: '97456321558',
        email: 'invalid-email'
      },
      expected: {
        success: false,
        errorName: 'ZodError',
        issuePath: 'email',
        issueMessage: 'Invalid email'
      }
    },
    {
      input: {
        name: 'John Doe',
        taxId: '9745632155',
        email: `${email}@required.com`
      },
      expected: {
        success: false,
        errorName: 'ZodError',
        issuePath: 'taxId',
        issueMessage: 'String must contain at least 11 character(s)'
      }
    }
  ]

  it.each(userInputRequiredFields)('should return 400 when required field are missing: %s', async ({ input, expected }) => {
    const httpClient = new AxiosAdapter()
    const response = await httpClient.post('http://127.0.0.1:8888/users', input)
    expect(response.status).toBe(400)
    expect(response.data.success).toBeFalsy()
    expect(response.data.error.name).toBe(expected.errorName)
    expect(response.data.error.issues[0].path[0]).toBe(expected.issuePath)
    expect(response.data.error.issues[0].message).toBe(expected.issueMessage)
  })

  it('should update user api', async () => {
    const httpClient = new AxiosAdapter()
    const entity = new UserEntity({
      name: new NameValueObject('John Doe'),
      email: new EmailValueObject(`${Date.now()}@update.com`),
      taxId: new TaxIdValueObject('97456321558')
    })
    await userRepository.save(entity)
    const input = {
      name: 'Jane Doe',
      email: `${Date.now()}@update.com`,
      taxId: '48894838021'
    }
    const response = await httpClient.patch(
      `http://127.0.0.1:8888/users/${entity.id.value}`,
      input
    )
    const { createdAt, updatedAt, ...output } = response.data
    expect(response.status).toBe(200)
    expect(output).toEqual({
      id: entity.id.value,
      name: input.name,
      email: input.email,
      taxId: input.taxId
    })
  })

  it('should get user api', async () => {
    const httpClient = new AxiosAdapter()
    const entity = new UserEntity({
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
