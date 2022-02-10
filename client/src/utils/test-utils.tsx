import { render } from '@testing-library/react';
import { AuthContext, IAuthContext, User } from 'contexts/AuthContext';

const user: User = {
  id: 1,
  username: 'mockUser',
  displayname: undefined,
  role: 'user',
};
const logout = jest.fn();
const updateUser = jest.fn();
const initial: IAuthContext = {
  user,
  logout,
  updateUser,
};

export const customRender = (ui: JSX.Element | Element | null, { IAuthContext = initial, ...renderOptions }: any) => {
  return render(<AuthContext.Provider value={IAuthContext}>{ui}</AuthContext.Provider>, renderOptions);
};
