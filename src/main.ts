import { GetUserUseCase, HonoAdapter, PersistUserUseCase, PgPromiseAdapter, UserHttpController, UserRepository } from './modules'

async function main (): Promise<void> {
  const connection = new PgPromiseAdapter()
  const userRepository = new UserRepository(connection)
  const persistUser = new PersistUserUseCase(userRepository)
  const getUser = new GetUserUseCase(userRepository)
  const httpServer = new HonoAdapter()
  new UserHttpController(
    httpServer,
    persistUser,
    getUser
  )
  httpServer.listen(8888)
}

main()
