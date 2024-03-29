import { IdValueObject, InvalidUUIDError } from '@modules/shared'
import { UserEntity } from '@modules/user'

const idString = 'd290f1ee-6c54-4b01-90e6-d701748f0851'

const userStub = {
  id: new IdValueObject(idString),
  name: 'John Doe',
  email: 'johndoe@email.com',
  password: '123456',
  createdAt: new Date(),
  updatedAt: new Date()
}

const userWithoutIdAndDatesStub = {
  name: 'John Doe',
  email: 'johndoe@email.com',
  password: '123456'
}

describe('UserEntity', () => {
  const validateSpy = vi.spyOn(IdValueObject.prototype as any, 'validate')

  it('should be create a new user entity', () => {
    const userEntity = new UserEntity(userStub)

    expect(userEntity).toBeInstanceOf(UserEntity)
    expect(userEntity.id).toBeInstanceOf(IdValueObject)
    expect(userEntity.id.value).toBe(userStub.id.value)
    expect(userEntity.name).toBe(userStub.name)
    expect(userEntity.email).toBe(userStub.email)
    expect(userEntity.password).toBe(userStub.password)
    expect(userEntity.createdAt).toBeInstanceOf(Date)
    expect(userEntity.updatedAt).toBeInstanceOf(Date)
  })

  it('should be create a new user entity without id and dates', () => {
    const userEntity = new UserEntity(userWithoutIdAndDatesStub)

    expect(userEntity).toBeInstanceOf(UserEntity)
    expect(userEntity.id).toBeInstanceOf(IdValueObject)
    expect(userEntity.id.value).not.toBe(userStub.id.value)
    expect(userEntity.name).toBe(userStub.name)
    expect(userEntity.email).toBe(userStub.email)
    expect(userEntity.password).toBe(userStub.password)
    expect(userEntity.createdAt).toBeInstanceOf(Date)
    expect(userEntity.updatedAt).toBeInstanceOf(Date)
  })

  it('should be throw an error if id is invalid', () => {
    expect(() => {
      new UserEntity({ ...userStub, id: new IdValueObject('invalid_id') })
      expect(validateSpy).toBeCalledTimes(1)
    }).toThrow(new InvalidUUIDError())
  })
})
