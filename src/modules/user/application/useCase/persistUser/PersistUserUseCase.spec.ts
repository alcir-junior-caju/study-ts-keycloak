import { IdValueObject } from '@modules/shared'
import { type UserRepositoryInterface, PersistUserUseCase, UserEntity } from '@modules/user'

const userStub = new UserEntity({
  id: new IdValueObject('123'),
  name: 'John Doe',
  email: 'johndoe@email.com',
  password: '123456'
})

const MockUserRepository = (updated?: boolean): UserRepositoryInterface => ({
  save: vitest.fn(),
  update: vitest.fn(),
  find: updated ? vitest.fn().mockResolvedValue(Promise.resolve(null)) : vitest.fn().mockResolvedValue(Promise.resolve(userStub))
})

describe('PersistUserUseCase', () => {
  it('should be able to persist a user', async () => {
    const userRepository = MockUserRepository()
    const persistUserUseCase = new PersistUserUseCase(userRepository)

    const input = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456'
    }

    const output = await persistUserUseCase.execute(input)

    expect(userRepository.save).toBeCalledTimes(1)
    expect(output.id).toBeDefined()
    expect(output.name).toBe(input.name)
    expect(output.email).toBe(input.email)
  })

  it('should be able to update a user', async () => {
    const userRepository = MockUserRepository()
    const persistUserUseCase = new PersistUserUseCase(userRepository)

    const input = {
      id: '123',
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456'
    }

    const output = await persistUserUseCase.execute(input)

    expect(userRepository.update).toBeCalledTimes(1)
    expect(output.id).toBe(input.id)
    expect(output.name).toBe(input.name)
    expect(output.email).toBe(input.email)
  })

  it('should not be able to update a user if not exists', async () => {
    const userRepository = MockUserRepository(true)
    const persistUserUseCase = new PersistUserUseCase(userRepository)

    const input = {
      id: 'xxx',
      name: 'xxx',
      email: 'xxx@email.com',
      password: 'xxxxxx'
    }

    await expect(persistUserUseCase.execute(input)).rejects.toThrow('user_not_found')
  })
})
