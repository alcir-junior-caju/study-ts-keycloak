import { InvalidNameError, NameValueObject } from '@modules/shared/domain'

describe('NameValueObject', () => {
  const validateSpy = vi.spyOn(NameValueObject.prototype as any, 'validate')

  it('should be invalid name value object', () => {
    expect(() => {
      new NameValueObject('')
      expect(validateSpy).toBeCalledTimes(1)
    }).toThrow(new InvalidNameError())

    expect(() => {
      new NameValueObject('j')
      expect(validateSpy).toBeCalledTimes(1)
    }).toThrow(new InvalidNameError())
  })

  it('should be test value with value', () => {
    const nameString = 'John Doe'
    const nameValueObject = new NameValueObject(nameString)
    expect(nameValueObject.value).toBe(nameString)
  })
})
