import { EmailValueObject, InvalidEmailError } from '@modules/shared/domain'

describe('EmailValueObject', () => {
  const validateSpy = vi.spyOn(EmailValueObject.prototype as any, 'validate')

  it('should be invalid email value object', () => {
    expect(() => {
      new EmailValueObject('')
      expect(validateSpy).toBeCalledTimes(1)
    }).toThrow(new InvalidEmailError())

    expect(() => {
      new EmailValueObject('johndoe')
      expect(validateSpy).toBeCalledTimes(1)
    }).toThrow(new InvalidEmailError())
  })

  it('should be test value with value', () => {
    const emailString = 'johndoe@email.com'
    const emailValueObject = new EmailValueObject(emailString)
    expect(emailValueObject.value).toBe(emailString)
  })
})
