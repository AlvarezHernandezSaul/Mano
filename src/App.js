import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar'; // Navbar global
import Impacto from './Pages/Impacto';
import Recursos from './Pages/Recursos';
import Home from './Pages/Home';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Impacto" element={<Impacto />} />
        <Route path="/Recursos" element={<Recursos />} />
      </Routes>
    </>
  );
};

export default App;
