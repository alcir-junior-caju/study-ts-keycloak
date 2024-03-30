import { EmailValueObject, IdValueObject, InvalidNameError, InvalidUUIDError, NameValueObject, TaxIdValueObject } from '@modules/shared'
import { CreateUserUseCase, UserEntity, type UserRepositoryInterface } from '@modules/user'

const idString = 'd290f1ee-6c54-4b01-90e6-d701748f0851'

const userStub = new UserEntity({
  id: new IdValueObject(idString),
  name: new NameValueObject('John Doe'),
  email: new EmailValueObject('johndoe@email.com'),
  taxId: new TaxIdValueObject('97456321558')
})

const MockUserRepository = (): UserRepositoryInterface => ({
  save: vitest.fn(),
  update: vitest.fn(),
  find: vitest.fn().mockResolvedValue(Promise.resolve(userStub))
})

describe('CreateUserUseCase Unit Tests', () => {
  it('should be able to persist a user', async () => {
    const userRepository = MockUserRepository()
    const persistUserUseCase = new CreateUserUseCase(userRepository)
    const input = {
      id: idString,
      name: 'John Doe',
      email: 'johndoe@email.com',
      taxId: '97456321558'
    }
    const output = await persistUserUseCase.execute(input)
    expect(userRepository.save).toBeCalledTimes(1)
    expect(output.id).toBe(input.id)
    expect(output.name).toBe(input.name)
    expect(output.email).toBe(input.email)
  })

  it('should be able to persist a user with invalid id', async () => {
    const userRepository = MockUserRepository()
    const persistUserUseCase = new CreateUserUseCase(userRepository)
    const input = {
      id: 'invalid-id',
      name: 'John Doe',
      email: 'johndoe@email.com',
      taxId: '97456321558'
    }
    await expect(persistUserUseCase.execute(input)).rejects.toThrow(new InvalidUUIDError())
  })

  it('should be able to persist a user with invalid name', async () => {
    const userRepository = MockUserRepository()
    const persistUserUseCase = new CreateUserUseCase(userRepository)
    const input = {
      id: idString,
      name: 'John',
      email: 'johndoe@email.com',
      taxId: '97456321558'
    }
    await expect(persistUserUseCase.execute(input)).rejects.toThrow(new InvalidNameError())
  })
})
