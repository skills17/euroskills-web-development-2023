import { User } from '../entities/User'

export const getUser = async (username: string) => {
  return User.findOneBy({ username });
}
