export interface InputPersistUserDto {
  id?: string
  name: string
  email: string
  taxId: string
}

export interface OutputPersistUserDto {
  id: string
  name: string
  email: string
  taxId: string
  createdAt: Date
  updatedAt: Date
}
