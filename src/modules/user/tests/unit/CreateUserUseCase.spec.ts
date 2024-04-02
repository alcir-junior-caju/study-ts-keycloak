import { EmailValueObject, IdValueObject, InvalidEmailError, InvalidNameError, InvalidUUIDError, NameValueObject, TaxIdValueObject } from '@modules/shared'
import { CreateUserUseCase, UserEntity, type UserRepositoryInterface } from '@modules/user'
import { Chance } from 'chance'

const chance = new Chance()
const idString = chance.guid()
const nameString = chance.name()
const emailString = chance.email()
const taxIdString = chance.cpf({ formatted: false })
const invalidIdString = chance.word()
const invalidNameString = chance.letter({ length: 1 })
const invalidEmailString = chance.word()

const userStub = new UserEntity({
  id: new IdValueObject(idString),
  name: new NameValueObject(nameString),
  email: new EmailValueObject(emailString),
  taxId: new TaxIdValueObject(taxIdString)
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
      name: nameString,
      email: emailString,
      taxId: taxIdString
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
      id: invalidIdString,
      name: nameString,
      email: emailString,
      taxId: taxIdString
    }
    await expect(persistUserUseCase.execute(input)).rejects.toThrow(new InvalidUUIDError())
  })

  it('should be able to persist a user with invalid name', async () => {
    const userRepository = MockUserRepository()
    const persistUserUseCase = new CreateUserUseCase(userRepository)
    const input = {
      id: idString,
      name: invalidNameString,
      email: emailString,
      taxId: taxIdString
    }
    await expect(persistUserUseCase.execute(input)).rejects.toThrow(new InvalidNameError())
  })

  it('should be able to persist a user with invalid email', async () => {
    const userRepository = MockUserRepository()
    const persistUserUseCase = new CreateUserUseCase(userRepository)
    const input = {
      id: idString,
      name: nameString,
      email: invalidEmailString,
      taxId: taxIdString
    }
    await expect(persistUserUseCase.execute(input)).rejects.toThrow(new InvalidEmailError())
  })
})
