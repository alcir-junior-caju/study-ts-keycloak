import { IdValueObject, InvalidUUIDError } from '@modules/shared'
import { Chance } from 'chance'

const chance = new Chance()
const idString = chance.guid()
const invalidIdString = chance.word()

describe('IdValueObject Unit Tests', () => {
  const validateSpy = vi.spyOn(IdValueObject.prototype as any, 'validate')

  it('should be test default value object empty', () => {
    const id = new IdValueObject()
    expect(id.value).toBeDefined()
  })

  it('should be test default value object with value', () => {
    const idValueObject = new IdValueObject(idString)
    expect(idValueObject.value).toBe(idString)
  })

  it('should be invalid id value object', () => {
    expect(() => {
      new IdValueObject(invalidIdString)
      expect(validateSpy).toBeCalledTimes(1)
    }).toThrow(new InvalidUUIDError())
  })
})
