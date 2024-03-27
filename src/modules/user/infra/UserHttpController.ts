import { createRoute } from '@hono/zod-openapi'
import { type HttpServerInterface } from '@modules/shared'
import { type Params } from 'hono/router'
import { z } from 'zod'

import { type GetUserUseCase, type PersistUserUseCase } from '../application'
import { type InputPersistUserDto } from '../application/useCase/persistUser/PersistUserDto'

const userSchemaPost = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8)
})

export class UserHttpController {
  private readonly httpServer: HttpServerInterface
  private readonly persistUserUseCase: PersistUserUseCase
  private readonly getUserUseCase: GetUserUseCase
  private readonly resource = '/users'

  constructor (
    httpServer: HttpServerInterface,
    persistUserUseCase: PersistUserUseCase,
    getUserUseCase: GetUserUseCase
  ) {
    this.httpServer = httpServer
    this.persistUserUseCase = persistUserUseCase
    this.getUserUseCase = getUserUseCase

    this.httpServer.on(
      createRoute({
        method: 'post',
        path: this.resource,
        tags: ['Users'],
        request: {
          body: {
            content: {
              'application/json': {
                schema: userSchemaPost
              }
            }
          }
        },
        responses: {
          200: {
            description: 'User created'
          },
          400: {
            description: 'Invalid input'
          }
        }
      }),
      async ({ body }: { body: InputPersistUserDto }) => {
        const { id, ...input } = body
        const output = await this.persistUserUseCase.execute(input)
        return output
      }
    )

    this.httpServer.on(
      createRoute({
        method: 'patch',
        path: `${this.resource}/:id`,
        tags: ['Users'],
        request: {
          params: z.object({
            id: z.string()
          }),
          body: {
            content: {
              'application/json': {
                schema: userSchemaPost
              }
            }
          }
        },
        responses: {
          200: {
            description: 'User updated'
          },
          400: {
            description: 'Invalid input'
          }
        }
      }),
      async ({ params, body }: { params: Params, body: InputPersistUserDto }) => {
        const { id } = params
        const output = await this.persistUserUseCase.execute({ ...body, id })
        return output
      }
    )

    this.httpServer.on(
      createRoute({
        method: 'get',
        path: `${this.resource}/:id`,
        tags: ['Users'],
        request: {
          params: z.object({
            id: z.string()
          })
        },
        responses: {
          200: {
            description: 'User found'
          },
          400: {
            description: 'Invalid input'
          }
        }
      }),
      async ({ params }: { params: Params }) => {
        const { id } = params
        const output = await this.getUserUseCase.execute({ id })
        return output
      }
    )
  }
}
