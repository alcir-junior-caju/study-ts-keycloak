import { InvalidNameError, NameValueObject } from '@modules/shared/domain'
import { Chance } from 'chance'

const chance = new Chance()
const validNameString = chance.name()
const invalidNameString = chance.letter({ length: 1 })

describe('NameValueObject Unit Tests', () => {
  const validateSpy = vi.spyOn(NameValueObject.prototype as any, 'validate')

  it('should be invalid name value object', () => {
    expect(() => {
      new NameValueObject('')
      expect(validateSpy).toBeCalledTimes(1)
    }).toThrow(new InvalidNameError())

    expect(() => {
      new NameValueObject(invalidNameString)
      expect(validateSpy).toBeCalledTimes(1)
    }).toThrow(new InvalidNameError())
  })

  it('should be test value with value', () => {
    const nameValueObject = new NameValueObject(validNameString)
    expect(nameValueObject.value).toBe(validNameString)
  })
})
