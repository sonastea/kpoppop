import { ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { createContext } from 'react';
import { getCurrentUser } from '../components/auth/AuthAPI';
import ValidateToken from '../components/auth/ValidateToken';

export type User = {
  sub?: number;
  username?: string;
  role?: string;
  isLoggedIn: boolean;
};

interface IAuthContext {
  user?: User;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<User>();
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);

  useEffect(() => {
    const checkUser = async () => {
      await getCurrentUser()
        .then((user) => {
          if (!user.isLoggedIn) {
            ValidateToken().then((user) => {
              setUser(user);
            });
          } else {
            setUser(user);
          }
        })
        .catch((_error) => {})
        .finally(() => setLoadingInitial(false));
    };
    checkUser();
  }, []);

  const memoedValues = useMemo(() => ({ user }), [user]);

  return <AuthContext.Provider value={memoedValues}>{!loadingInitial && children}</AuthContext.Provider>;
}

export default function useAuth() {
  return useContext(AuthContext);
}
