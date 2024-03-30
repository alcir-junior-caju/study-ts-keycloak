import { type AggregateRootInterface, BaseEntity, type EmailValueObject, type IdValueObject, type NameValueObject, type TaxIdValueObject } from '@modules/shared'

interface Input {
  id?: IdValueObject
  name: NameValueObject
  email: EmailValueObject
  taxId: TaxIdValueObject
  createdAt?: Date
  updatedAt?: Date
}

export class UserEntity extends BaseEntity implements AggregateRootInterface {
  private readonly _name: NameValueObject
  private readonly _email: EmailValueObject
  private readonly _taxId: TaxIdValueObject

  constructor ({ id, name, email, taxId, createdAt, updatedAt }: Input) {
    super(id, createdAt, updatedAt)
    this._name = name
    this._email = email
    this._taxId = taxId
  }

  get name (): NameValueObject {
    return this._name
  }

  get email (): EmailValueObject {
    return this._email
  }

  get taxId (): TaxIdValueObject {
    return this._taxId
  }
}
