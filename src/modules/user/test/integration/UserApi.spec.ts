import axios from 'axios'

axios.defaults.validateStatus = () => true

describe('UserApi', () => {
  it('should persist user api', async () => {
    const input = {
      name: 'John Doe',
      email: 'johndoe@mail.com',
      password: '123456'
    }
    const response = await axios.post('http://127.0.0.1:8888/users', input)
    expect(response.status).toBe(200)
    expect(response.data).toEqual({
      id: expect.any(String),
      name: input.name,
      email: input.email
    })
  })
})
