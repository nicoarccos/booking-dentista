'use client';

import { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import LoginModal from './LoginBox';

const LoginButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={toggleModal}
        className="fixed top-4 right-4 flex items-center px-4 py-2 rounded-full text-white font-semibold transition-colors duration-300 shadow-md z-50 bg-blue-500 hover:bg-blue-600"
      >
        <FaUser className="mr-2" />
        LOG IN
      </button>

      <LoginModal isOpen={isOpen} onClose={toggleModal} />
    </>
  );
};

export default LoginButton;
