// frontend/src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Signup from './components/Signup';
import Login from './components/Login';
import ItemsPage from './components/ItemsPage';
import CartPage from './components/CartPage';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Navigate to="/items" replace />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/items" element={<ItemsPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;