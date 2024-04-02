import { InvalidTaxIdError, TaxIdValueObject } from '@modules/shared/domain'
import { Chance } from 'chance'

const chance = new Chance()
const validTaxIds = [
  chance.cpf({ formatted: false }),
  chance.cpf({ formatted: false }),
  chance.cpf({ formatted: false })
]
const invalidTaxIds = [
  '8774824880',
  null,
  undefined,
  '11111111111'
]

describe('TaxIdValueObject Unit Tests', () => {
  const validateSpy = vi.spyOn(TaxIdValueObject.prototype as any, 'validate')

  it.each(validTaxIds)('should be test valid Tax ID value object: %s', (taxId: string) => {
    expect(new TaxIdValueObject(taxId)).toBeDefined()
  })

  it.each(invalidTaxIds)('should be test invalid Tax ID value object: %s', (taxId: any) => {
    expect(() => {
      new TaxIdValueObject(taxId)
      expect(validateSpy).toBeCalledTimes(1)
    }).toThrow(new InvalidTaxIdError())
  })
})
