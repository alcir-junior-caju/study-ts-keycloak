import { InvalidTaxIdError, TaxIdValueObject } from '@modules/shared/domain'

describe('TaxIdValueObject Unit Tests', () => {
  const validateSpy = vi.spyOn(TaxIdValueObject.prototype as any, 'validate')

  it.each([
    '97456321558',
    '71428793860',
    '87748248800'
  ])('should be test valid Tax ID value object: %s', (cpf: string) => {
    expect(new TaxIdValueObject(cpf)).toBeDefined()
  })

  it.each([
    '8774824880',
    null,
    undefined,
    '11111111111'
  ])('should be test invalid Tax ID value object: %s', (cpf: any) => {
    expect(() => {
      new TaxIdValueObject(cpf)
      expect(validateSpy).toBeCalledTimes(1)
    }).toThrow(new InvalidTaxIdError())
  })
})
