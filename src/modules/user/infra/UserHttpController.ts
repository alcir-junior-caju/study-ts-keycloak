import { createRoute } from '@hono/zod-openapi'
import { type HttpServerInterface } from '@modules/shared'
import { type Params } from 'hono/router'

import { type GetUserUseCase, type PersistUserUseCase } from '../application'
import { type InputPersistUserDto } from '../application/useCase/persistUser/PersistUserDto'

import { userGetRoute, userPatchRoute, userPostRoute } from './swaggerConfig'

export class UserHttpController {
  private readonly httpServer: HttpServerInterface
  private readonly persistUserUseCase: PersistUserUseCase
  private readonly getUserUseCase: GetUserUseCase

  constructor (
    httpServer: HttpServerInterface,
    persistUserUseCase: PersistUserUseCase,
    getUserUseCase: GetUserUseCase
  ) {
    this.httpServer = httpServer
    this.persistUserUseCase = persistUserUseCase
    this.getUserUseCase = getUserUseCase

    this.httpServer.on(
      createRoute(userPostRoute),
      async ({ body }: { body: InputPersistUserDto }) => {
        const { id, ...input } = body
        const output = await this.persistUserUseCase.execute(input)
        return output
      }
    )

    this.httpServer.on(
      createRoute(userPatchRoute),
      async ({ params, body }: { params: Params, body: InputPersistUserDto }) => {
        const { id } = params
        const output = await this.persistUserUseCase.execute({ ...body, id })
        return output
      }
    )

    this.httpServer.on(
      createRoute(userGetRoute),
      async ({ params }: { params: Params }) => {
        const { id } = params
        console.log('id', id)
        const output = await this.getUserUseCase.execute({ id })
        return output
      }
    )
  }
}
