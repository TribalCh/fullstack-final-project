import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Products from './pages/Products';
import SalesOrders from './pages/SalesOrder';

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/products" element={<Products />} />
          <Route path="/sales-orders" element={<SalesOrders />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
