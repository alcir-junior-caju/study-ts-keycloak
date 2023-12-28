import { IdValueObject } from '../valueObject'
import { BaseEntity } from './BaseEntity'

describe('BaseEntity', () => {
  it('should be test default entity empty', () => {
    const entity = new BaseEntity()

    expect(entity.id).toBeDefined()
    expect(entity.createdAt).toBeDefined()
    expect(entity.updatedAt).toBeDefined()
  })

  it('should be test default entity with values', () => {
    const id = new IdValueObject('123')
    const createdAt = new Date()
    const updatedAt = new Date()

    const entity = new BaseEntity(id, createdAt, updatedAt)

    expect(entity.id).toBe(id)
    expect(entity.createdAt).toBe(createdAt)
    expect(entity.updatedAt).toBe(updatedAt)
  })

  it('should be test default entity with get id', () => {
    const id = new IdValueObject('123')
    const entity = new BaseEntity(id)

    expect(entity.id).toBe(id)
  })

  it('should be test default entity with get createdAt', () => {
    const createdAt = new Date()
    const entity = new BaseEntity(undefined, createdAt)

    expect(entity.createdAt).toBe(createdAt)
  })

  it('should be test default entity with get updatedAt', () => {
    const updatedAt = new Date()
    const entity = new BaseEntity(undefined, undefined, updatedAt)

    expect(entity.updatedAt).toBe(updatedAt)
  })
})
