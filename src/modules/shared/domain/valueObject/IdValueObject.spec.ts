import { IdValueObject } from './IdValueObject'

describe('IdValueObject', () => {
  it('should be test default value object empty', () => {
    const id = new IdValueObject()

    expect(id.value).toBeDefined()
  })

  it('should be test default value object with value', () => {
    const idString = '123'
    const idValueObject = new IdValueObject(idString)

    expect(idValueObject.value).toBe(idString)
  })
})
