import { IdValueObject } from '@modules/shared'
import { GetUserUseCase, UserEntity, type UserRepositoryInterface } from '@modules/user'

const userStub = new UserEntity({
  id: new IdValueObject('123'),
  name: 'John Doe',
  email: 'johndoe@email.com',
  password: '123456'
})

const MockUserRepository = (empty?: boolean): UserRepositoryInterface => ({
  save: vitest.fn(),
  update: vitest.fn(),
  find: empty ? vitest.fn().mockResolvedValue(Promise.resolve(null)) : vitest.fn().mockResolvedValue(Promise.resolve(userStub))
})

describe('GetUserUseCase', () => {
  it('should be able to get a user', async () => {
    const userRepository = MockUserRepository()
    const getUserUseCase = new GetUserUseCase(userRepository)

    const input = {
      id: '123'
    }

    const output = await getUserUseCase.execute(input)

    expect(userRepository.find).toBeCalledTimes(1)
    expect(output.id).toBe(userStub.id.value)
    expect(output.name).toBe(userStub.name)
    expect(output.email).toBe(userStub.email)
  })

  it('should not be able to get a user if not exists', async () => {
    const userRepository = MockUserRepository(true)
    const getUserUseCase = new GetUserUseCase(userRepository)

    const input = {
      id: '123'
    }

    await expect(getUserUseCase.execute(input)).rejects.toThrow('user_not_found')
  })
})
