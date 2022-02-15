import { render } from '@testing-library/react';
import { AuthContext, IAuthContext, User } from 'contexts/AuthContext';

export const user: User = {
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

const customRender = (ui: JSX.Element | Element | null, { Context = initial, ...renderOptions }: any) => {
  return render(<AuthContext.Provider value={Context}>{ui}</AuthContext.Provider>, renderOptions);
};

export * from '@testing-library/react';
export { customRender as render };
