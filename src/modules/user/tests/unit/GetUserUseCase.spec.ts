import { EmailValueObject, IdValueObject, NameValueObject, TaxIdValueObject } from '@modules/shared'
import { GetUserUseCase, UserEntity, type UserRepositoryInterface } from '@modules/user'
import { Chance } from 'chance'

const chance = new Chance()
const idString = chance.guid()
const nameString = chance.name()
const emailString = chance.email()
const taxIdString = chance.cpf({ formatted: false })

const userStub = new UserEntity({
  id: new IdValueObject(idString),
  name: new NameValueObject(nameString),
  email: new EmailValueObject(emailString),
  taxId: new TaxIdValueObject(taxIdString)
})

const MockUserRepository = (empty?: boolean): UserRepositoryInterface => ({
  save: vitest.fn(),
  update: vitest.fn(),
  find: empty ? vitest.fn().mockResolvedValue(Promise.resolve(null)) : vitest.fn().mockResolvedValue(Promise.resolve(userStub))
})

describe('GetUserUseCase Unit Tests', () => {
  it('should be able to get a user', async () => {
    const userRepository = MockUserRepository()
    const getUserUseCase = new GetUserUseCase(userRepository)
    const input = {
      id: idString
    }
    const output = await getUserUseCase.execute(input)
    expect(userRepository.find).toBeCalledTimes(1)
    expect(output.id).toBe(userStub.id.value)
    expect(output.name).toBe(userStub.name.value)
    expect(output.email).toBe(userStub.email.value)
    expect(output.taxId).toBe(userStub.taxId.value)
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
