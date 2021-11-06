import React from 'react';

const AuthContext = React.createContext({
  isLoggedIn: JSON.parse(localStorage.getItem('isLoggedIn')),
  username: localStorage.getItem('current-user'),
  role: JSON.parse(localStorage.getItem('role')),
  'user-id': localStorage.getItem('user-id') || 0
});

export default AuthContext;