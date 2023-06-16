import { API_URL } from 'Global.d';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type User = {
  id?: number;
  discordId?: string;
  username?: string;
  role?: string;
  displayname?: string;
  photo?: string;
};

export type LoginFormData = {
  username: string;
  password: string;
};

export interface IAuthContext {
  user?: User;
  login: (data: LoginFormData) => Promise<any>;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser?: User;
}): JSX.Element {
  const [user, setUser] = useState<User>(initialUser as User);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);

  useEffect(() => {
    const getCurrentUser = async () => {
      await fetch(`${API_URL}/auth/session`, {
        method: 'GET',
        credentials: 'include',
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.id || data.discordId) {
            setUser(data);
            localStorage.setItem('userID', data.id);
          }
        })
        .catch((_error) => {})
        .finally(() => setLoadingInitial(false));
    };
    getCurrentUser();
  }, []);

  const login = useCallback(async (data: LoginFormData) => {
    return await fetch(`${API_URL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
  }, []);

  const logout = useCallback(async () => {
    await fetch(`${API_URL}/user/logout`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          window.location.reload();
          localStorage.removeItem('userID');
          localStorage.removeItem('notifiedUserToLogin');
        }
      })
      .catch((error) => console.log(error));
  }, []);

  const updateUser = useCallback(async (user: User) => {
    setUser(user);
  }, []);

  const memoedValues = useMemo(
    () => ({ user, login, logout, updateUser }),
    [user, login, logout, updateUser]
  );

  return (
    <AuthContext.Provider value={memoedValues}>{!loadingInitial && children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
