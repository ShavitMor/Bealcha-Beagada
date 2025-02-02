import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import { i } from 'framer-motion/client';
import Book from './components/Book';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
   <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/reading/:bookTitle" element={<Book />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;