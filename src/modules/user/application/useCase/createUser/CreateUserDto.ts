export interface InputCreateUserDto {
  id: string
  name: string
  email: string
  createdAt?: Date
  updatedAt?: Date
}

export interface OutputCreateUserDto {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}
