import React, { useState, useEffect } from 'react';
import SalesOrderForm from '../components/SalesOrderForm';
import SalesOrderList from '../components/SalesOrderList';

const SalesOrders = () => {
  const [orders, setOrders] = useState([]);
  const [products] = useState([
    { id: 1, name: 'Product A', price: 10 },
    { id: 2, name: 'Product B', price: 20 },
  ]);

  // Load orders from localStorage on component mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Save orders to localStorage whenever they are updated
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const handleAddOrder = (order) => {
    const newOrder = { ...order, id: Date.now() };
    setOrders([...orders, newOrder]);
  };

  const handleDeleteOrder = (id) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  return (
    <div>
      <h1>Sales Orders</h1>
      <SalesOrderForm products={products} onSubmit={handleAddOrder} />
      <SalesOrderList orders={orders} onDelete={handleDeleteOrder} />
    </div>
  );
};

export default SalesOrders;
