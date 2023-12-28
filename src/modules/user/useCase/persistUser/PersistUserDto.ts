export interface InputPersistUserDto {
  id?: string
  name: string
  email: string
  password: string
}

export interface OutputPersistUserDto {
  id: string
  name: string
  email: string
}
