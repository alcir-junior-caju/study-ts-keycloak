import { type AggregateRootInterface, BaseEntity, type IdValueObject, type NameValueObject } from '@modules/shared'

interface Input {
  id?: IdValueObject
  name: NameValueObject
  email: string
  password: string
  createdAt?: Date
  updatedAt?: Date
}

export class UserEntity extends BaseEntity implements AggregateRootInterface {
  private readonly _name: NameValueObject
  private readonly _email: string
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

  get email (): string {
    return this._email
  }

  get password (): string {
    return this._password
  }
}
