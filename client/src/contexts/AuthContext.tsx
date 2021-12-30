import { ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { createContext } from 'react';
import { getCurrentUser } from '../components/auth/AuthAPI';
import ValidateToken from '../components/auth/ValidateToken';

export type User = {
  _id?: number;
  username?: string;
  role?: string;
};

interface IAuthContext {
  user?: User;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<User>();
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        if (user._id === null) {
          ValidateToken()
            .then((user) => {
              if (user._id) setUser(user);
            });
        } else {
          setUser(user);
        }
      })
      .catch((_error) => {})
      .finally(() => setLoadingInitial(false));
  }, []);

  const memoedValues = useMemo(() => ({ user }), [user]);

  return (
    <AuthContext.Provider value={memoedValues}>{!loadingInitial && children}</AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}
