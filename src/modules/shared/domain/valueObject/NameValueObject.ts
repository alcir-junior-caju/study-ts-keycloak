import { type ValueObjectInterface } from './ValueObjectInterface'

export class NameValueObject implements ValueObjectInterface {
  private readonly _value: string

  constructor (name: string) {
    this._value = name
    this.validate(name)
  }

  get value (): string {
    return this._value
  }

  private validate (name: string): void {
    const isValid = !!name.match(/[a-zA-Z] [a-zA-Z]+/)
    if (!isValid) throw new InvalidNameError()
  }
}

export class InvalidNameError extends Error {
  constructor () {
    super('name_must_be_a_valid_name')
    this.name = 'invalid_name_error'
  }
}
