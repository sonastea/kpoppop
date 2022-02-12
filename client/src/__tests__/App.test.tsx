import { MemoryRouter, Route, Routes } from 'react-router';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { User } from 'contexts/AuthContext';
import { render } from 'utils/test-utils';
import NavBar from 'components/NavBar';
import Home from 'components/Home';
import '@testing-library/jest-dom';
import Profile from 'components/user/Profile';

describe('Render app according to authentication status', () => {
  test('Render app as anonymous user', () => {
    const user: User = {};

    render(
      <MemoryRouter initialEntries={['/']}>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </MemoryRouter>,
      { Context: { user } }
    );

    expect(screen.getByText('Home')).toHaveTextContent('Home');
    expect(screen.getByText('Sign Up').closest('a')).toHaveAttribute('href', '/register');
    expect(screen.getByText('Login').closest('a')).toHaveAttribute('href', '/login');
  });

  test('Render app as authenticated user', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="user/profile/:username" element={<Profile />} />
        </Routes>
      </MemoryRouter>,
      {}
    );

    expect(screen.getByText('Home')).toHaveTextContent('Home');
    userEvent.click(screen.getByText('mockUser'));

    expect(screen.getByText('Profile').closest('a')).toHaveTextContent('Profile');
    expect(screen.getByText('Profile').closest('a')).toHaveAttribute('href', '/user/profile/mockUser');
  });
});
