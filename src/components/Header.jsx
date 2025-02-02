import React, { useState } from 'react';
import { FaXmark, FaBars } from 'react-icons/fa6';
import { Link } from 'react-scroll';
import '../styles/Header.css'

const Header = () => {
  
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  }

  const closeMenu = () => {
    setMenuOpen(false);
  }

  const navItems = [
  
  ];

  return (
    <nav id="header" className='w-full flex bg-white justify-between items-center gap-1 lg:px-16 px-6 py-4 sticky top-0 z-50'>
      <h1 
        className="text-black md:text-4xl text-3xl font-bold cursor-pointer" 
        style={{ fontSize: '40px' }} 
        onClick={() => window.location.href = '/'}
      >
        בהלכה ובאגדה
      </h1>
      {/* Add menu toggle icon and mobile menu here */}
      {window.location.pathname !== '/' && (
        <button onClick={() => window.location.href = '/'} className='bg-yellow-500 font-bold hover:bg-black hover:text-white text-black px-10 py-3 rounded-full font-semibold transform hover:scale-105 transition-transform duration-300 cursor-pointer flex'>
          לספרייה
        </button>
      )}
    </nav>
  );
}

export default Header;
