export interface InputChangeUserDto {
  id: string
  name?: string
  email?: string
  taxId?: string
  updatedAt?: Date
}

export interface OutputChangeUserDto {
  id: string
  name: string
  email: string
  taxId: string
  createdAt: Date
  updatedAt: Date
}
