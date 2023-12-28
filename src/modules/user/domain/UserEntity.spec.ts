import { IdValueObject } from '@modules/shared'
import { UserEntity } from './UserEntity'

const userStub = {
  id: new IdValueObject('123'),
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
})
