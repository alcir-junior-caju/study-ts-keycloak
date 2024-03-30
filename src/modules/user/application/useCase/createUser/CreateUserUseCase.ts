import { EmailValueObject, IdValueObject, NameValueObject, type UseCaseInterface } from '@modules/shared'
import { type UserRepositoryInterface } from '@modules/user'
import { UserEntity } from '@modules/user/domain'

import { type InputCreateUserDto, type OutputCreateUserDto } from './CreateUserDto'

export class CreateUserUseCase implements UseCaseInterface<InputCreateUserDto, OutputCreateUserDto> {
  private readonly _userRepository: UserRepositoryInterface

  constructor (userRepository: UserRepositoryInterface) {
    this._userRepository = userRepository
  }

  async execute (input: InputCreateUserDto): Promise<OutputCreateUserDto> {
    const inputUser = {
      id: new IdValueObject(input.id),
      name: new NameValueObject(input.name),
      email: new EmailValueObject(input.email),
      ...(input?.createdAt && { createdAt: input.createdAt }),
      ...(input?.updatedAt && { updatedAt: input.updatedAt })
    }
    const user = new UserEntity(inputUser)
    await this._userRepository.save(user)
    return {
      id: user.id.value,
      name: user.name.value,
      email: user.email.value,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }
}
