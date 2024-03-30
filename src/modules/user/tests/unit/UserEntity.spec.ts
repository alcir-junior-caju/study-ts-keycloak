import { EmailValueObject, IdValueObject, InvalidEmailError, InvalidNameError, InvalidUUIDError, NameValueObject, TaxIdValueObject } from '@modules/shared'
import { UserEntity } from '@modules/user'

const idString = 'd290f1ee-6c54-4b01-90e6-d701748f0851'

const userStub = {
  id: new IdValueObject(idString),
  name: new NameValueObject('John Doe'),
  email: new EmailValueObject('johndoe@email.com')
}

describe('UserEntity Unit Tests', () => {
  it('should be create a new user entity', () => {
    const userEntity = new UserEntity(userStub)
    expect(userEntity).toBeInstanceOf(UserEntity)
    expect(userEntity.id).toBeInstanceOf(IdValueObject)
    expect(userEntity.id.value).toBe(userStub.id.value)
    expect(userEntity.name).toBeInstanceOf(NameValueObject)
    expect(userEntity.name.value).toBe(userStub.name.value)
    expect(userEntity.email).toBeInstanceOf(EmailValueObject)
    expect(userEntity.email.value).toBe(userStub.email.value)
    expect(userEntity.createdAt).toBeInstanceOf(Date)
    expect(userEntity.updatedAt).toBeInstanceOf(Date)
  })

  it('should be create a new user entity with dates', () => {
    const date = new Date()
    const userEntity = new UserEntity({
      ...userStub,
      createdAt: date,
      updatedAt: date
    })
    expect(userEntity).toBeInstanceOf(UserEntity)
    expect(userEntity.id).toBeInstanceOf(IdValueObject)
    expect(userEntity.id.value).toBe(userStub.id.value)
    expect(userEntity.name).toBeInstanceOf(NameValueObject)
    expect(userEntity.name.value).toBe(userStub.name.value)
    expect(userEntity.email).toBeInstanceOf(EmailValueObject)
    expect(userEntity.email.value).toBe(userStub.email.value)
    expect(userEntity.createdAt).toBeInstanceOf(Date)
    expect(userEntity.updatedAt).toBeInstanceOf(Date)
  })

  it('should be create a new user entity with tax id', () => {
    const taxId = new TaxIdValueObject('97456321558')
    const userEntity = new UserEntity({
      ...userStub,
      taxId
    })
    expect(userEntity).toBeInstanceOf(UserEntity)
    expect(userEntity.id).toBeInstanceOf(IdValueObject)
    expect(userEntity.id.value).toBe(userStub.id.value)
    expect(userEntity.name).toBeInstanceOf(NameValueObject)
    expect(userEntity.name.value).toBe(userStub.name.value)
    expect(userEntity.email).toBeInstanceOf(EmailValueObject)
    expect(userEntity.email.value).toBe(userStub.email.value)
    expect(userEntity.taxId).toBeInstanceOf(TaxIdValueObject)
    expect(userEntity.taxId.value).toBe(taxId.value)
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

  it('should be throw an error if taxId is invalid', () => {
    expect(() => {
      new UserEntity({ ...userStub, taxId: new TaxIdValueObject('invalid-tax-id') })
    }).toThrow()
  })
})
