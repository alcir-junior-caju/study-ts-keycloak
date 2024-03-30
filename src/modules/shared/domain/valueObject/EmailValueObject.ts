import { type ValueObjectInterface } from './ValueObjectInterface'

export class EmailValueObject implements ValueObjectInterface {
  private readonly _value: string

  constructor (email: string) {
    this._value = email
    this.validate(email)
  }

  get value (): string {
    return this._value
  }

  private validate (email: string): void {
    const isValid = !!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    if (!isValid) throw new InvalidEmailError()
  }
}

export class InvalidEmailError extends Error {
  constructor () {
    super('email_must_be_a_valid_email')
    this.name = 'invalid_email_error'
  }
}
