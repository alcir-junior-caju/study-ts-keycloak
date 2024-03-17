import { AxiosAdapter } from '@modules/shared'

describe('UserApi', () => {
  it('should persist user api', async () => {
    const httpClient = new AxiosAdapter()
    const input = {
      name: 'John Doe',
      email: `${Date.now()}@example.com`,
      password: '123456789'
    }
    const response = await httpClient.post('http://127.0.0.1:8888/users', input)
    console.log('RES', response)
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
})
