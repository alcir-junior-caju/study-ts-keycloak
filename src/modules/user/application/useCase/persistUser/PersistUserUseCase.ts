import { IdValueObject, type UseCaseInterface } from '@modules/shared'
import { type UserRepositoryInterface } from '@modules/user'
import { type InputPersistUserDto, type OutputPersistUserDto } from './PersistUserDto'
import { UserEntity } from '@modules/user/domain'

export class PersistUserUseCase implements UseCaseInterface<InputPersistUserDto, OutputPersistUserDto> {
  private readonly _userRepository: UserRepositoryInterface

  constructor (userRepository: UserRepositoryInterface) {
    this._userRepository = userRepository
  }

  async execute (input: InputPersistUserDto): Promise<OutputPersistUserDto> {
    const inputUser = {
      name: input.name,
      email: input.email,
      password: input.password
    }
    const userExists = await this.updateUserIfExist(input)
    if (userExists === null) throw new Error('user_not_found')
    if (userExists) {
      Object.assign(inputUser, { id: new IdValueObject(input.id) })
      const user = new UserEntity(inputUser)
      await this._userRepository.update(user)
      return {
        id: user.id.value,
        name: user.name,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }
    const user = new UserEntity(inputUser)
    await this._userRepository.save(user)
    return {
      id: user.id.value,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }

  private async updateUserIfExist (user: InputPersistUserDto): Promise<boolean | null> {
    if (!user?.id) return false
    const userExists = await this._userRepository.find(user.id)
    if (!userExists) return null
    return !!userExists
  }
}
