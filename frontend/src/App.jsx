import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Optional Navbar component
import Register from './pages/register';
import Login from './pages/login';
import CreateProduct from './pages/CreateProduct';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductList from './components/ProductList';
import Orders from './pages/Orders';
function App() {
  return (
    <Router>
      <Navbar /> {/* Add the Navbar to all routes */}
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-product" element={<CreateProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
