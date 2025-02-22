import { API_URL } from 'Global.d';
import {
  createContext,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { toast } from 'react-toastify/unstyled';

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

enum ActionType {
  LOGOUT = 'LOGOUT',
  UPDATE_USER = 'UPDATE_USER',
}

type AuthAction = {
  type: ActionType;
  payload: User;
};

const authReducer = (state: User | undefined, action: AuthAction) => {
  switch (action.type) {
    case ActionType.LOGOUT:
      window.location.reload();
      localStorage.removeItem('userID');
      localStorage.removeItem('notifiedUserToLogin');
      sessionStorage.removeItem('current-user');
      return { ...state };

    case ActionType.UPDATE_USER:
      sessionStorage.setItem('current-user', JSON.stringify(action.payload));
      return { ...state, ...action.payload };

    default:
      return state;
  }
};

const initialAuthContext: IAuthContext = {
  user: JSON.parse(sessionStorage.getItem('current-user')!) ?? undefined,
  login: () => Promise.resolve(),
  logout: () => {},
  updateUser: () => {},
};

export const AuthContext = createContext<IAuthContext>(initialAuthContext);

const AuthProviderComponent = ({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: User | undefined;
}): ReactElement => {
  const [user, dispatch] = useReducer(authReducer, initialUser);

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
          dispatch({ type: ActionType.LOGOUT, payload: {} });
        }
        return response.text();
      })
      .then((statusText: string) => {
        console.warn(statusText);
        dispatch({ type: ActionType.LOGOUT, payload: {} });
      })
      .catch((error) => console.log(error));
  }, [dispatch]);

  const updateUser = useCallback(
    async (user: User) => {
      dispatch({ type: ActionType.UPDATE_USER, payload: user });
    },
    [dispatch]
  );

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/session`, {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          if (data.id || data.discordId) {
            updateUser(data);
            localStorage.setItem('userID', data.id);
          }
        } else {
          throw new Error('Failed to fetch');
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.message === 'Failed to fetch') {
          toast.error('Unable to reach user session data. Please try again later.');
        }
        if (error instanceof TypeError && error.message === 'Load failed') {
          toast.error('Servers are down. Please try again later.');
        }
      }
    };
    getCurrentUser();
  }, []);

  const memoedValues = useMemo(
    () => ({ user, login, logout, updateUser }),
    [user, login, logout, updateUser]
  );

  return <AuthContext.Provider value={memoedValues}>{children}</AuthContext.Provider>;
};

export const useAuth = (): IAuthContext => useContext(AuthContext);

export const AuthProvider = AuthProviderComponent;

export default AuthContext;
