import { type HttpServerInterface } from '@modules/shared'
import { type PersistUserUseCase } from '../application'
import { type InputPersistUserDto } from '../application/useCase/persistUser/PersistUserDto'

export class UserHttpController {
  httpServer: HttpServerInterface
  persistUser: PersistUserUseCase

  constructor (httpServer: HttpServerInterface, persistUser: PersistUserUseCase) {
    this.httpServer = httpServer
    this.persistUser = persistUser

    this.httpServer.on('POST', '/users', async (_: any, body: InputPersistUserDto) => {
      const output = await this.persistUser.execute(body)
      return output
    })

    this.httpServer.on('PATCH', '/users/:id', async (id: string, body: InputPersistUserDto) => {
      const output = await this.persistUser.execute({ ...body, id })
      return output
    })
  }
}
