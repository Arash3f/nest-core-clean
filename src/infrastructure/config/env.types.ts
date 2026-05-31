export enum NodeEnv {
  Production = "production",
  Development = "development",
  Test = "test",
}

export type ConfigUser = {
  name: string
  username: string
  password: string
}

export type DatabaseConfig = {
  connectionUrl: string
  name: string
  username: string
  password: string
  port: string
  host: string
}
