import { createRoute } from '@hono/zod-openapi'
import { type HttpServerInterface } from '@modules/shared'
import { type Params } from 'hono/router'

import { type CreateUserUseCase, type GetUserUseCase } from '../application'
import { type InputCreateUserDto } from '../application/useCase/createUser/CreateUserDto'

import { userGetRoute } from './swaggerConfig'

export class UserHttpController {
  private readonly httpServer: HttpServerInterface
  private readonly createUserUseCase: CreateUserUseCase
  private readonly getUserUseCase: GetUserUseCase

  constructor (
    httpServer: HttpServerInterface,
    createUserUseCase: CreateUserUseCase,
    getUserUseCase: GetUserUseCase
  ) {
    this.httpServer = httpServer
    this.createUserUseCase = createUserUseCase
    this.getUserUseCase = getUserUseCase

    // this.httpServer.on(
    //   createRoute(userPostRoute),
    //   async ({ body }: { body: InputCreateUserDto }) => {
    //     const output = await this.createUserUseCase.execute(body)
    //     return output
    //   }
    // )

    // this.httpServer.on(
    //   createRoute(userPatchRoute),
    //   async ({ params, body }: { params: Params, body: InputCreateUserDto }) => {
    //     const { id } = params
    //     const output = await this.createUserUseCase.execute({ ...body, id })
    //     return output
    //   }
    // )

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
