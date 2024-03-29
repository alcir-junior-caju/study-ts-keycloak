import { IdValueObject } from '@modules/shared'
import { GetUserUseCase, UserEntity, type UserRepositoryInterface } from '@modules/user'

const idString = 'd290f1ee-6c54-4b01-90e6-d701748f0851'

const userStub = new UserEntity({
  id: new IdValueObject(idString),
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
      id: idString
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
      id: idString
    }

    await expect(getUserUseCase.execute(input)).rejects.toThrow('user_not_found')
  })
})
