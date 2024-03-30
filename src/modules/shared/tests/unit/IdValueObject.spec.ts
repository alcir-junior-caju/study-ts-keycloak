import { IdValueObject, InvalidUUIDError } from '@modules/shared'

describe('IdValueObject Unit Tests', () => {
  const validateSpy = vi.spyOn(IdValueObject.prototype as any, 'validate')

  it('should be test default value object empty', () => {
    const id = new IdValueObject()
    expect(id.value).toBeDefined()
  })

  it('should be test default value object with value', () => {
    const idString = 'd290f1ee-6c54-4b01-90e6-d701748f0851'
    const idValueObject = new IdValueObject(idString)
    expect(idValueObject.value).toBe(idString)
  })

  it('should be invalid id value object', () => {
    expect(() => {
      new IdValueObject('invalid-id')
      expect(validateSpy).toBeCalledTimes(1)
    }).toThrow(new InvalidUUIDError())
  })
})
