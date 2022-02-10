import { customRender } from '../../utils/test-utils';
import { User } from '../../contexts/AuthContext';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Profile from './Profile';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

test(`Render profile page unauthenticated`, () => {
  const user: User = {};

  customRender(
    <MemoryRouter initialEntries={['/user/profile/mockUser']}>
      <Routes>
        <Route path="/user/profile/:username" element={<Profile />} />
      </Routes>
    </MemoryRouter>,
    { IAuthContext: { user } }
  );

  expect(screen.getByText(`mockUser`)).toHaveTextContent(`mockUser`);
});

test(`Render profile page authenticated`, () => {
  const user: User = {
    id: 1,
    username: 'mockUser',
    displayname: undefined,
    role: 'user',
  };

  customRender(
    <MemoryRouter initialEntries={[`/user/profile/${user.username}`]}>
      <Routes>
        <Route path="/user/profile/:username" element={<Profile />} />
      </Routes>
    </MemoryRouter>,
    { IAuthContext: { user } }
  );

  expect(screen.getByText(`Hello, ${user.username}`)).toHaveTextContent(`Hello, ${user.username}`);
});
