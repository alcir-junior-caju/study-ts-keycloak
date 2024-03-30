import { type AggregateRootInterface, BaseEntity, type EmailValueObject, type IdValueObject, type NameValueObject } from '@modules/shared'

interface Input {
  id?: IdValueObject
  name: NameValueObject
  email: EmailValueObject
  password: string
  createdAt?: Date
  updatedAt?: Date
}

export class UserEntity extends BaseEntity implements AggregateRootInterface {
  private readonly _name: NameValueObject
  private readonly _email: EmailValueObject
  private readonly _password: string

  constructor ({ id, name, email, password, createdAt, updatedAt }: Input) {
    super(id, createdAt, updatedAt)
    this._name = name
    this._email = email
    this._password = password
  }

  get name (): NameValueObject {
    return this._name
  }

  get email (): EmailValueObject {
    return this._email
  }

  get password (): string {
    return this._password
  }
}
