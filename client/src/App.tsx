import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './components/Home';
import Login from './components/user/Login';
import Signup from './components/user/Signup';
import NavBar from './components/NavBar';
import Profile from './components/user/Profile';

const App = () => {
  return (
    <BrowserRouter>
      <>
        <NavBar />
      </>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/user/profile" element={<Profile />} />
      </Routes>

    </BrowserRouter>
  );
};

export default App;
