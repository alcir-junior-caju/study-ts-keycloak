import { EmailValueObject, IdValueObject, InvalidNameError, InvalidUUIDError, NameValueObject } from '@modules/shared'
import { PersistUserUseCase, UserEntity, type UserRepositoryInterface } from '@modules/user'

const idString = 'd290f1ee-6c54-4b01-90e6-d701748f0851'

const userStub = new UserEntity({
  id: new IdValueObject(idString),
  name: new NameValueObject('John Doe'),
  email: new EmailValueObject('johndoe@email.com'),
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
      id: idString,
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
      id: idString,
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '12345678'
    }

    await expect(persistUserUseCase.execute(input)).rejects.toThrow('user_not_found')
  })

  it('should be able to persist a user with invalid id', async () => {
    const userRepository = MockUserRepository()
    const persistUserUseCase = new PersistUserUseCase(userRepository)

    const input = {
      id: 'invalid-id',
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456'
    }

    await expect(persistUserUseCase.execute(input)).rejects.toThrow(new InvalidUUIDError())
  })

  it('should be able to persist a user with invalid name', async () => {
    const userRepository = MockUserRepository()
    const persistUserUseCase = new PersistUserUseCase(userRepository)

    const input = {
      name: 'John',
      email: 'johndoe@email.com',
      password: '123456'
    }

    await expect(persistUserUseCase.execute(input)).rejects.toThrow(new InvalidNameError())
  })
})
