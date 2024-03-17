import { type HttpServerInterface } from '@modules/shared'
import { type GetUserUseCase, type PersistUserUseCase } from '../application'
import { type InputPersistUserDto } from '../application/useCase/persistUser/PersistUserDto'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { type Next } from 'hono'
import { type Params } from 'hono/router'

const userSchemaPost = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8)
})

export class UserHttpController {
  httpServer: HttpServerInterface
  persistUser: PersistUserUseCase
  getUser: GetUserUseCase
  private readonly baseUrl = '/users'

  constructor (
    httpServer: HttpServerInterface,
    persistUser: PersistUserUseCase,
    getUser: GetUserUseCase
  ) {
    this.httpServer = httpServer
    this.persistUser = persistUser
    this.getUser = getUser

    this.httpServer.on(
      'POST',
      this.baseUrl,
      zValidator('json', userSchemaPost, (result, context) => {
        if (!result.success) context.json({ message: 'invalid_input' }, { status: 400 })
      }),
      async (_: any, body: InputPersistUserDto) => {
        const { id, ...input } = body
        const output = await this.persistUser.execute(input)
        return output
      }
    )

    this.httpServer.on(
      'PATCH',
      `${this.baseUrl}/:id`,
      async (_: any, next: Next) => { await next() },
      async (params: Params, body: InputPersistUserDto) => {
        const { id } = params
        const output = await this.persistUser.execute({ ...body, id })
        return output
      }
    )

    this.httpServer.on(
      'GET',
      `${this.baseUrl}/:id`,
      async (_: any, next: Next) => { await next() },
      async (params: Params, body: InputPersistUserDto) => {
        const { id } = params
        const output = await this.getUser.execute({ id })
        console.log('OUTPUT', output)
        return output
      }
    )
  }
}
