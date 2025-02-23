import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from 'components/Home';
import NavBar from 'components/NavBar';
import Profile from 'components/user/Profile';
import { User } from 'contexts/AuthContext';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render } from 'utils/test-utils';

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
    expect(screen.getByText('Profile').closest('a')).toHaveAttribute(
      'href',
      '/user/profile/mockUser'
    );
  });
});
