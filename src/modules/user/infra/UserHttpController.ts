import { createRoute } from '@hono/zod-openapi'
import { type HttpServerInterface } from '@modules/shared'
import { type Params } from 'hono/router'

import { type ChangeUserUseCase, type GetUserUseCase } from '../application'
import { type InputChangeUserDto } from '../application/useCase/changeUser/ChangeUserDto'

import { userGetRoute, userPatchRoute } from './swaggerConfig'

export class UserHttpController {
  private readonly httpServer: HttpServerInterface
  private readonly changeUserUseCase: ChangeUserUseCase
  private readonly getUserUseCase: GetUserUseCase

  constructor (
    httpServer: HttpServerInterface,
    changeUserUseCase: ChangeUserUseCase,
    getUserUseCase: GetUserUseCase
  ) {
    this.httpServer = httpServer
    this.changeUserUseCase = changeUserUseCase
    this.getUserUseCase = getUserUseCase

    this.httpServer.on(
      createRoute(userPatchRoute),
      async ({ params, body }: { params: Params, body: InputChangeUserDto }) => {
        const { id } = params
        const output = await this.changeUserUseCase.execute({ ...body, id })
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
