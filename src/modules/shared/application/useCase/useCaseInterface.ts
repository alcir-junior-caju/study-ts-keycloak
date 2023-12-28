export interface UseCaseInterface<T, U> {
  execute: (input: T) => Promise<U>
}
