import { EmailValueObject, IdValueObject, InvalidEmailError, InvalidNameError, InvalidTaxIdError, NameValueObject, TaxIdValueObject } from '@modules/shared'
import { ChangeUserUseCase, UserEntity, type UserRepositoryInterface } from '@modules/user'

const idString = 'd290f1ee-6c54-4b01-90e6-d701748f0851'
const idStringChange = 'd290f1ee-6c54-4b01-90e6-d701748f0852'

const userStub = new UserEntity({
  id: new IdValueObject(idString),
  name: new NameValueObject('John Doe'),
  email: new EmailValueObject('johndoe@email.com'),
  taxId: new TaxIdValueObject('97456321558')
})

const changeUserStub = new UserEntity({
  id: new IdValueObject(idStringChange),
  name: new NameValueObject('Jane Doe'),
  email: new EmailValueObject('janedoe@rmail.com'),
  taxId: new TaxIdValueObject('71428793860')
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
      name: 'Jane Doe',
      email: 'janedoe@email.com',
      taxId: '71428793860',
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
      id: 'd290f1ee-6c54-4b01-90e6-d701748f0853',
      name: 'Jane Doe',
      email: 'janedoe@email.com',
      taxId: '71428793860'
    }
    await expect(changeUserUseCase.execute(input)).rejects.toThrow(new Error('user_not_found'))
  })

  it('should be able to change a user with invalid name', async () => {
    const userRepository = MockUserRepository()
    const changeUserUseCase = new ChangeUserUseCase(userRepository)
    const input = {
      id: idStringChange,
      name: 'Jane',
      email: 'janedoe@email.com',
      taxId: '71428793860',
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
      name: 'Jane Doe',
      email: 'janedoe@',
      taxId: '71428793860',
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
      name: 'Jane Doe',
      email: 'janedoe@email.com',
      taxId: '11111111111',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    }
    await expect(changeUserUseCase.execute(input)).rejects.toThrow(new InvalidTaxIdError())
  })
})
