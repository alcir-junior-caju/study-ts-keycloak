import { IdValueObject } from '../valueObject'

export class BaseEntity {
  private readonly _id: IdValueObject
  private readonly _createdAt: Date
  private readonly _updatedAt: Date

  constructor (id?: IdValueObject, createdAt?: Date, updatedAt?: Date) {
    this._id = id ?? new IdValueObject()
    this._createdAt = createdAt ?? new Date()
    this._updatedAt = updatedAt ?? new Date()
  }

  get id (): IdValueObject {
    return this._id
  }

  get createdAt (): Date {
    return this._createdAt
  }

  get updatedAt (): Date {
    return this._updatedAt
  }
}
