import { v4 as uuidv4, validate as uuidValidate } from 'uuid'

import { type ValueObjectInterface } from './ValueObjectInterface'

export class IdValueObject implements ValueObjectInterface {
  private readonly _value: string

  constructor (id?: string) {
    this._value = id ?? uuidv4()
    this.validate()
  }

  get value (): string {
    return this._value
  }

  private validate (): void {
    const isValid = uuidValidate(this.value)
    if (!isValid) throw new InvalidUUIDError()
  }
}

export class InvalidUUIDError extends Error {
  constructor () {
    super('id_must_be_a_valid_uuid')
    this.name = 'invalid_uuid_error'
  }
}
