import { EmailValueObject, IdValueObject, InvalidEmailError, InvalidNameError, InvalidUUIDError, NameValueObject } from '@modules/shared'
import { UserEntity } from '@modules/user'

const idString = 'd290f1ee-6c54-4b01-90e6-d701748f0851'

const userStub = {
  id: new IdValueObject(idString),
  name: new NameValueObject('John Doe'),
  email: new EmailValueObject('johndoe@email.com'),
  password: '123456',
  createdAt: new Date(),
  updatedAt: new Date()
}

const userWithoutIdAndDatesStub = {
  name: new NameValueObject('John Doe'),
  email: new EmailValueObject('johndoe@email.com'),
  password: '123456'
}

describe('UserEntity', () => {
  it('should be create a new user entity', () => {
    const userEntity = new UserEntity(userStub)

    expect(userEntity).toBeInstanceOf(UserEntity)
    expect(userEntity.id).toBeInstanceOf(IdValueObject)
    expect(userEntity.id.value).toBe(userStub.id.value)
    expect(userEntity.name.value).toBe(userStub.name.value)
    expect(userEntity.email.value).toBe(userStub.email.value)
    expect(userEntity.password).toBe(userStub.password)
    expect(userEntity.createdAt).toBeInstanceOf(Date)
    expect(userEntity.updatedAt).toBeInstanceOf(Date)
  })

  it('should be create a new user entity without id and dates', () => {
    const userEntity = new UserEntity(userWithoutIdAndDatesStub)

    expect(userEntity).toBeInstanceOf(UserEntity)
    expect(userEntity.id).toBeInstanceOf(IdValueObject)
    expect(userEntity.id.value).not.toBe(userStub.id.value)
    expect(userEntity.name.value).toBe(userStub.name.value)
    expect(userEntity.email.value).toBe(userStub.email.value)
    expect(userEntity.password).toBe(userStub.password)
    expect(userEntity.createdAt).toBeInstanceOf(Date)
    expect(userEntity.updatedAt).toBeInstanceOf(Date)
  })

  it('should be throw an error if id is invalid', () => {
    expect(() => {
      new UserEntity({ ...userStub, id: new IdValueObject('invalid_id') })
    }).toThrow(new InvalidUUIDError())
  })

  it('should be throw an error if name is invalid', () => {
    expect(() => {
      new UserEntity({ ...userStub, name: new NameValueObject('invalid-name') })
    }).toThrow(new InvalidNameError())
  })

  it('should be throw an error if email is invalid', () => {
    expect(() => {
      new UserEntity({ ...userStub, email: new EmailValueObject('invalid-email') })
    }).toThrow(new InvalidEmailError())
  })
})
