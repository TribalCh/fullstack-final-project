import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <h1>Product and Sales Order Management</h1>
      <nav>
        <Link to="/products">Products</Link> | <Link to="/sales-orders">Sales Orders</Link>
      </nav>
    </header>
  );
};

export default Header;
