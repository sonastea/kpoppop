import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { User } from 'contexts/AuthContext';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render } from 'utils/test-utils';
import Profile from '../Profile';

describe('Render profile page according to authentication status', () => {
  test(`Render profile page unauthenticated`, () => {
    render(
      <MemoryRouter initialEntries={['/user/profile/mockUser']}>
        <Routes>
          <Route path="/user/profile/:username" element={<Profile />} />
        </Routes>
      </MemoryRouter>,
      { Context: {} }
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

    render(
      <MemoryRouter initialEntries={[`/user/profile/${user.username}`]}>
        <Routes>
          <Route path="/user/profile/:username" element={<Profile />} />
        </Routes>
      </MemoryRouter>,
      { Context: { user } }
    );

    expect(screen.getByText(`Hello, ${user.username}`)).toHaveTextContent(
      `Hello, ${user.username}`
    );
  });
});
