import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreateClient from './pages/CreateClient';
import ProductInventory from './pages/ProductInventory';
import ShoppingCart from './pages/ShoppingCart';
import OrderReview from './pages/OrderReview';
import Dispatch from './pages/Dispatch';
import Shipping from './pages/Shipping';
import Payments from './pages/Payments';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create-client" element={<CreateClient />} />
        <Route path="/inventory" element={<ProductInventory />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/orders" element={<OrderReview />} />
        <Route path="/dispatch" element={<Dispatch />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/payments" element={<Payments />} />
      </Routes>
    </Layout>
  );
}

export default App;