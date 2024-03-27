import { AxiosAdapter, PgPromiseAdapter } from '@modules/shared'
import { UserEntity } from '@modules/user/domain'
import { UserRepository } from '@modules/user/repository'

describe('UserApi', () => {
  let connection: PgPromiseAdapter
  let userRepository: UserRepository

  beforeAll(async () => {
    connection = new PgPromiseAdapter()
    userRepository = new UserRepository(connection)
  })

  afterAll(async () => {
    await connection.close()
  })

  it('should persist user api', async () => {
    const httpClient = new AxiosAdapter()
    const input = {
      name: 'John Doe',
      email: `${Date.now()}@create.com`,
      password: '123456789'
    }
    const response = await httpClient.post('http://127.0.0.1:8888/users', input)
    expect(response.status).toBe(200)
    expect(response.data).toEqual({
      id: expect.any(String),
      name: input.name,
      email: input.email,
      password: input.password,
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
        issuePath: 'password',
        issueMessage: 'Required'
      }
    },
    {
      input: {
        name: 'John Doe',
        password: '123456789'
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
        password: '123456789'
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
        password: '123456789',
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
        password: '123456789',
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
        password: '123',
        email: `${email}@required.com`
      },
      expected: {
        success: false,
        errorName: 'ZodError',
        issuePath: 'password',
        issueMessage: 'String must contain at least 8 character(s)'
      }
    }
  ]

  it.each(userInputRequiredFields)('should return 500 when required fields are missing', async ({ input, expected }) => {
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
      name: 'John Doe',
      email: `${Date.now()}@update.com`,
      password: '123456789'
    })
    await userRepository.save(entity)
    const input = {
      name: 'Jane Doe',
      email: `${Date.now()}@update.com`,
      password: '987654321'
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
      password: input.password
    })
  })

  it('should get user api', async () => {
    const httpClient = new AxiosAdapter()
    const entity = new UserEntity({
      name: 'John Doe',
      email: `${Date.now()}@get.com`,
      password: '123456789'
    })
    await userRepository.save(entity)
    const response = await httpClient.get(`http://127.0.0.1:8888/users/${entity.id.value}`)
    const { createdAt, updatedAt, ...output } = response.data
    expect(response.status).toBe(200)
    expect(output).toEqual({
      id: entity.id.value,
      name: entity.name,
      email: entity.email
    })
  })
})
