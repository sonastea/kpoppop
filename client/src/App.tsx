import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './components/Home';
import Login from './components/user/Login';
import Signup from './components/user/Signup';
import NavBar from './components/NavBar';

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
      </Routes>

    </BrowserRouter>
  );
};

export default App;
