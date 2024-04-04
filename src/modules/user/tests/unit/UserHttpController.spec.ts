import { UserHttpController } from '@modules/user/infra'
import { Chance } from 'chance'

const chance = new Chance()
const idString = chance.guid()
const nameString = chance.name()

const mockHttpServer = {
  on: vitest.fn(),
  listen: vitest.fn()
}

const mockChangeUserUseCase = {
  execute: vitest.fn()
}

const mockGetUserUseCase = {
  execute: vitest.fn()
}

const mockParams = { id: idString }
const mockBody = { name: nameString }

describe('UserHttpController Unit Tests', () => {
  it('should be creates routes for patch and get requests', () => {
    new UserHttpController(
      mockHttpServer,
      mockChangeUserUseCase as any,
      mockGetUserUseCase as any
    )
    expect(mockHttpServer.on).toHaveBeenCalledTimes(2)
    expect(mockHttpServer.on).toHaveBeenCalledWith(expect.any(Object), expect.any(Function))
  })

  it('should be calls ChangeUserUseCase on patch request', async () => {
    new UserHttpController(
      mockHttpServer,
      mockChangeUserUseCase as any,
      mockGetUserUseCase as any
    )
    const mockContext = { params: mockParams, body: mockBody }
    await mockHttpServer.on.mock.calls[0][1](mockContext)
    expect(mockChangeUserUseCase.execute).toHaveBeenCalledTimes(1)
    expect(mockChangeUserUseCase.execute).toHaveBeenCalledWith({ ...mockBody, id: mockParams.id })
  })

  it('should be calls GetUserUseCase on get request', async () => {
    new UserHttpController(
      mockHttpServer,
      mockChangeUserUseCase as any,
      mockGetUserUseCase as any
    )
    const mockContext = { params: mockParams }
    await mockHttpServer.on.mock.calls[1][1](mockContext)
    expect(mockGetUserUseCase.execute).toHaveBeenCalledTimes(1)
    expect(mockGetUserUseCase.execute).toHaveBeenCalledWith({ id: mockParams.id })
  })
})
