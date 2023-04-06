import { pbkdf2Sync, randomBytes } from 'node:crypto'

export const createUserPassword = (password: string) => {
  const salt = randomBytes(16).toString('hex')

  return pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
}
