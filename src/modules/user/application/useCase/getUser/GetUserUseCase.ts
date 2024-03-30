import { type UseCaseInterface } from '@modules/shared'

import { type UserRepositoryInterface } from '../../repository'

import { type InputGetUserDto, type OutputGetUserDto } from './GetUserDto'

export class GetUserUseCase implements UseCaseInterface<InputGetUserDto, OutputGetUserDto> {
  private readonly _userRepository: UserRepositoryInterface

  constructor (userRepository: UserRepositoryInterface) {
    this._userRepository = userRepository
  }

  async execute (input: InputGetUserDto): Promise<OutputGetUserDto> {
    const user = await this._userRepository.find(input.id)
    if (!user) throw new Error('user_not_found')
    return {
      id: user.id.value,
      name: user.name.value,
      email: user.email.value,
      taxId: user.taxId.value,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }
}
