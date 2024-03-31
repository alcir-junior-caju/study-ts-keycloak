import { ChangeUserUseCase, GetUserUseCase, HonoAdapter, PgPromiseAdapter, UserHttpController, UserRepository } from './modules'

async function main (): Promise<void> {
  const connection = new PgPromiseAdapter()
  const userRepository = new UserRepository(connection)
  const changeUser = new ChangeUserUseCase(userRepository)
  const getUser = new GetUserUseCase(userRepository)
  const httpServer = new HonoAdapter()
  new UserHttpController(
    httpServer,
    changeUser,
    getUser
  )
  httpServer.listen(8888)
}

main()
