import { EmailValueObject, InvalidEmailError } from '@modules/shared/domain'
import { Chance } from 'chance'

const chance = new Chance()
const validEmailString = chance.email()
const invalidEmailString = chance.word()

describe('EmailValueObject Unit Tests', () => {
  const validateSpy = vi.spyOn(EmailValueObject.prototype as any, 'validate')

  it('should be invalid email value object', () => {
    expect(() => {
      new EmailValueObject('')
      expect(validateSpy).toBeCalledTimes(1)
    }).toThrow(new InvalidEmailError())

    expect(() => {
      new EmailValueObject(invalidEmailString)
      expect(validateSpy).toBeCalledTimes(1)
    }).toThrow(new InvalidEmailError())
  })

  it('should be test value with value', () => {
    const emailValueObject = new EmailValueObject(validEmailString)
    expect(emailValueObject.value).toBe(validEmailString)
  })
})
