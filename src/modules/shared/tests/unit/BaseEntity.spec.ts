import { BaseEntity, IdValueObject, InvalidUUIDError } from '@modules/shared'

describe('BaseEntity Unit Tests', () => {
  it('should be test entity empty', () => {
    const entity = new BaseEntity()
    expect(entity.id).toBeDefined()
    expect(entity.createdAt).toBeDefined()
    expect(entity.updatedAt).toBeDefined()
  })

  it('should be test entity with values', () => {
    const idString = 'd290f1ee-6c54-4b01-90e6-d701748f0851'
    const id = new IdValueObject(idString)
    const createdAt = new Date()
    const updatedAt = new Date()
    const entity = new BaseEntity(id, createdAt, updatedAt)
    expect(entity.id).toBe(id)
    expect(entity.createdAt).toBe(createdAt)
    expect(entity.updatedAt).toBe(updatedAt)
  })

  it('should be test entity with get id', () => {
    const idString = 'd290f1ee-6c54-4b01-90e6-d701748f0851'
    const id = new IdValueObject(idString)
    const entity = new BaseEntity(id)
    expect(entity.id).toBe(id)
  })

  it('should be test entity with get createdAt', () => {
    const createdAt = new Date()
    const entity = new BaseEntity(undefined, createdAt)
    expect(entity.createdAt).toBe(createdAt)
  })

  it('should be test entity with get updatedAt', () => {
    const updatedAt = new Date()
    const entity = new BaseEntity(undefined, undefined, updatedAt)
    expect(entity.updatedAt).toBe(updatedAt)
  })

  it('should be test entity with invalid id', () => {
    expect(() => {
      new BaseEntity(new IdValueObject('invalid-id'))
    }).toThrow(new InvalidUUIDError())
  })
})
