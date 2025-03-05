'use client';

import { useState } from 'react';
import { FaUser } from 'react-icons/fa';

const LoginButton: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <button
      onClick={handleLogin}
      className={`fixed top-4 right-4 flex items-center px-4 py-2 rounded-full text-white font-semibold transition-colors duration-300 shadow-md z-50
        ${isLoggedIn ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
    >
      <FaUser className="mr-2" />
      {isLoggedIn ? 'LOG OUT' : 'LOG IN'}
    </button>
  );
};

export default LoginButton;
