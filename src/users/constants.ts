import { IUserType } from './user.interface';

export const USER_TYPES: IUserType[] = [
  {
    id: '1',
    name: 'admin',
    description: `[BUILT-IN-TYPE] This user type indicates an admin user.
    This means, they have access to all features, like create new products,
    categories, etc.`
  },
  {
    id: '2',
    name: 'normal',
    description: `[BUILT-IN-TYPE] This user type indicates a normal user.
    Limited access to some features.`
  }
]