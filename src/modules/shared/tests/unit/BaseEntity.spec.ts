import { BaseEntity, IdValueObject, InvalidUUIDError } from '@modules/shared'
import { Chance } from 'chance'

const chance = new Chance()
const idString = chance.guid()
const createdAt = chance.date()
const updatedAt = chance.date()

describe('BaseEntity Unit Tests', () => {
  it('should be test entity empty', () => {
    const entity = new BaseEntity()
    expect(entity.id).toBeDefined()
    expect(entity.createdAt).toBeDefined()
    expect(entity.updatedAt).toBeDefined()
  })

  it('should be test entity with values', () => {
    const id = new IdValueObject(idString)
    const entity = new BaseEntity(id, createdAt, updatedAt)
    expect(entity.id).toBe(id)
    expect(entity.createdAt).toBe(createdAt)
    expect(entity.updatedAt).toBe(updatedAt)
  })

  it('should be test entity with get id', () => {
    const id = new IdValueObject(idString)
    const entity = new BaseEntity(id)
    expect(entity.id).toBe(id)
  })

  it('should be test entity with get createdAt', () => {
    const entity = new BaseEntity(undefined, createdAt)
    expect(entity.createdAt).toBe(createdAt)
  })

  it('should be test entity with get updatedAt', () => {
    const entity = new BaseEntity(undefined, undefined, updatedAt)
    expect(entity.updatedAt).toBe(updatedAt)
  })

  it('should be test entity with invalid id', () => {
    expect(() => {
      new BaseEntity(new IdValueObject('invalid-id'))
    }).toThrow(new InvalidUUIDError())
  })
})
