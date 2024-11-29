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
import RatedProductsPage from './pages/RatedProductsPage';
import AdminPage from './pages/AdminPage';
import SearchPage from './pages/SearchPage';
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/rated-products" element={<RatedProductsPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-product" element={<CreateProduct />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </Router>
  );
}

export default App;
