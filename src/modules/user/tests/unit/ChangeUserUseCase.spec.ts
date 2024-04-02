import { EmailValueObject, IdValueObject, InvalidEmailError, InvalidNameError, InvalidTaxIdError, NameValueObject, TaxIdValueObject } from '@modules/shared'
import { ChangeUserUseCase, UserEntity, type UserRepositoryInterface } from '@modules/user'
import { Chance } from 'chance'

const chance = new Chance()
const idString = chance.guid()
const nameString = chance.name()
const emailString = chance.email()
const taxIdString = chance.cpf({ formatted: false })
const idStringChange = chance.guid()
const nameStringChange = chance.name()
const emailStringChange = chance.email()
const taxIdStringChange = chance.cpf({ formatted: false })
const idStringNotFound = chance.guid()
const invalidNameString = chance.letter({ length: 1 })
const invalidEmailString = chance.word()

const userStub = new UserEntity({
  id: new IdValueObject(idString),
  name: new NameValueObject(nameString),
  email: new EmailValueObject(emailString),
  taxId: new TaxIdValueObject(taxIdString)
})

const changeUserStub = new UserEntity({
  id: new IdValueObject(idStringChange),
  name: new NameValueObject(nameStringChange),
  email: new EmailValueObject(emailStringChange),
  taxId: new TaxIdValueObject(taxIdStringChange)
})

const MockUserRepository = (notFound?: boolean): UserRepositoryInterface => ({
  save: vitest.fn().mockResolvedValue(Promise.resolve(userStub)),
  update: vitest.fn().mockResolvedValue(Promise.resolve(changeUserStub)),
  find: notFound ? vitest.fn() : vitest.fn().mockResolvedValue(Promise.resolve(userStub))
})

describe('ChangeUserUseCase Unit Tests', () => {
  it('should be able to change a user', async () => {
    const userRepository = MockUserRepository()
    const changeUserUseCase = new ChangeUserUseCase(userRepository)
    const input = {
      id: idStringChange,
      name: nameStringChange,
      email: emailStringChange,
      taxId: taxIdStringChange,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    }
    const changeUser = await changeUserUseCase.execute(input)
    expect(changeUser).toEqual({
      id: input.id,
      name: input.name,
      email: input.email,
      taxId: input.taxId,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
  })

  it('should be able to change a user not found', async () => {
    const userRepository = MockUserRepository(true)
    const changeUserUseCase = new ChangeUserUseCase(userRepository)
    const input = {
      id: idStringNotFound,
      name: nameStringChange,
      email: emailStringChange,
      taxId: taxIdStringChange
    }
    await expect(changeUserUseCase.execute(input)).rejects.toThrow(new Error('user_not_found'))
  })

  it('should be able to change a user with invalid name', async () => {
    const userRepository = MockUserRepository()
    const changeUserUseCase = new ChangeUserUseCase(userRepository)
    const input = {
      id: idStringChange,
      name: invalidNameString,
      email: emailStringChange,
      taxId: taxIdStringChange,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    }
    await expect(changeUserUseCase.execute(input)).rejects.toThrow(new InvalidNameError())
  })

  it('should be able to change a user with invalid email', async () => {
    const userRepository = MockUserRepository()
    const changeUserUseCase = new ChangeUserUseCase(userRepository)
    const input = {
      id: idStringChange,
      name: nameStringChange,
      email: invalidEmailString,
      taxId: taxIdStringChange,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    }
    await expect(changeUserUseCase.execute(input)).rejects.toThrow(new InvalidEmailError())
  })

  it('should be able to change a user with invalid tax id', async () => {
    const userRepository = MockUserRepository()
    const changeUserUseCase = new ChangeUserUseCase(userRepository)
    const input = {
      id: idStringChange,
      name: nameStringChange,
      email: emailStringChange,
      taxId: '11111111111',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    }
    await expect(changeUserUseCase.execute(input)).rejects.toThrow(new InvalidTaxIdError())
  })
})
