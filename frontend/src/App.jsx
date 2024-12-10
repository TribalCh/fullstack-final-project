import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Products from './pages/Products';
import SalesOrders from './pages/SalesOrder';
import OrderDetailsPage from './pages/OrderDetailsPage';


function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/products" element={<Products />} />
          <Route path="/sales-orders" element={<SalesOrders />} />
          <Route path="/order-details/:orderId" element={<OrderDetailsPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
