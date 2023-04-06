// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      password: string
      email: string
      avatar?: string
    }
    meals: {
      id: string
      name: string
      description: string
      datetime: Date
      userId: string
      inDiet: boolean
    }
  }
}
