import { ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createContext } from 'react';
import { API_URL } from '../Global.d';

export type User = {
  id?: number;
  username?: string;
  role?: string;
  displayname?: string;
};

interface IAuthContext {
  user?: User;
  logout: () => void;
  updateUser: (user:User) => void;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<User>();
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);

  useEffect(() => {
    const getCurrentUser = async () => {
      await fetch(`${API_URL}/auth/session`, {
        method: 'GET',
        credentials: 'include',
      })
      .then(response => response.json())
      .then(data => {
        if (data.id) {
          setUser(data);
        }
      })
      .catch((_error) => {})
      .finally(() => setLoadingInitial(false));
    };
    getCurrentUser();
  }, []);


  const logout = useCallback(async () => {
    await fetch(`${API_URL}/user/logout`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          window.location.reload();
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const updateUser = useCallback(async (user: User) => {
    setUser(user);
  }, []);

  const memoedValues = useMemo(() => ({ user, logout, updateUser }), [user, logout, updateUser]);

  return <AuthContext.Provider value={memoedValues}>{!loadingInitial && children}</AuthContext.Provider>;
}

export default function useAuth() {
  return useContext(AuthContext);
}
