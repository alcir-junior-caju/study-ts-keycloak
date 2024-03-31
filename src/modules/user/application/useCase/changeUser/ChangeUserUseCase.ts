import { EmailValueObject, NameValueObject, TaxIdValueObject, type UseCaseInterface } from '@modules/shared'
import { type UserRepositoryInterface } from '@modules/user'
import { UserEntity } from '@modules/user/domain'

import { type InputChangeUserDto, type OutputChangeUserDto } from './ChangeUserDto'

export class ChangeUserUseCase implements UseCaseInterface<InputChangeUserDto, OutputChangeUserDto> {
  private readonly _userRepository: UserRepositoryInterface

  constructor (userRepository: UserRepositoryInterface) {
    this._userRepository = userRepository
  }

  async execute (input: InputChangeUserDto): Promise<OutputChangeUserDto> {
    const { id, ...user } = input
    const userExists = await this._userRepository.find(id)
    if (!userExists) throw new Error('user_not_found')
    const entity = new UserEntity({
      name: user.name ? new NameValueObject(user.name) : userExists.name,
      email: user.email ? new EmailValueObject(user.email) : userExists.email,
      taxId: user.taxId ? new TaxIdValueObject(user.taxId) : userExists.taxId,
      updatedAt: new Date()
    })
    await this._userRepository.update(entity)
    return {
      id,
      name: entity.name.value,
      email: entity.email.value,
      taxId: entity.taxId.value,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    }
  }
}
