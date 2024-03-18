import { AxiosAdapter, PgPromiseAdapter } from '@modules/shared'
import { UserEntity } from '@modules/user/domain'
import { UserRepository } from '@modules/user/repository'

describe('UserApi', () => {
  it('should persist user api', async () => {
    const httpClient = new AxiosAdapter()
    const input = {
      name: 'John Doe',
      email: `${Date.now()}@example.com`,
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

  it('should get user api', async () => {
    const connection = new PgPromiseAdapter()
    const userRepository = new UserRepository(connection)
    const httpClient = new AxiosAdapter()
    const entity = new UserEntity({
      name: 'John Doe',
      email: `${Date.now()}@example.com`,
      password: '123456789'
    })
    await userRepository.save(entity)
    const response = await httpClient.get(`http://127.0.0.1:8888/users/${entity.id.value}`)
    const { createdAt, updatedAt, ...rest } = response.data
    expect(response.status).toBe(200)
    expect(rest).toEqual({
      id: entity.id.value,
      name: entity.name,
      email: entity.email
    })
  })
})
