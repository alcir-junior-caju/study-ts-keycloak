import { type ValueObjectInterface } from './ValueObjectInterface'

export class TaxIdValueObject implements ValueObjectInterface {
  private readonly _value: string

  constructor (value: string) {
    this._value = value
    this.validate(value)
  }

  private validate (rawTaxId: string): void {
    if (!rawTaxId) throw new InvalidTaxIdError()
    const taxId = this.removeNonDigits(rawTaxId)
    if (this.isInvalidLength(taxId)) throw new InvalidTaxIdError()
    if (this.hasAllDigitsEqual(taxId)) throw new InvalidTaxIdError()
    const digit1 = this.calculateDigit(taxId, 10)
    const digit2 = this.calculateDigit(taxId, 11)
    if (this.extractDigit(taxId) === `${digit1}${digit2}`) return
  }

  private removeNonDigits (taxId: string): string {
    return taxId.replace(/\D/g, '')
  }

  private isInvalidLength (taxId: string): boolean {
    const TAX_ID_LENGTH = 11
    return taxId.length !== TAX_ID_LENGTH
  }

  private hasAllDigitsEqual (taxId: string): boolean {
    const [firstTaxIdDigit] = Array.from(taxId)
    return Array.from(taxId).every(digit => digit === firstTaxIdDigit)
  }

  private calculateDigit (taxId: string, factor: number): number {
    let total = 0
    for (const digit of taxId) {
      if (factor > 1) total += parseInt(digit) * factor--
    }
    const rest = total % 11
    return (rest < 2) ? 0 : 11 - rest
  }

  private extractDigit (taxId: string): string {
    return taxId.slice(9)
  }

  get value (): string {
    return this._value
  }
}

export class InvalidTaxIdError extends Error {
  constructor () {
    super('tax_id_must_be_a_valid_tax_id')
    this.name = 'invalid_tax_id_error'
  }
}
