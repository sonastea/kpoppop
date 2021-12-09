import { createContext } from 'react';

interface IAuthContext {
  _id: number;
  username: string;
  role: string;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export default AuthContext;
