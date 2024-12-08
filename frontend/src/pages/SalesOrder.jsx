import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import SalesOrderForm from '../components/SalesOrderForm';
import SalesOrderList from '../components/SalesOrderList';

const SalesOrders = () => {
  const [orders, setOrders] = useState([]);
  const [products] = useState([
    { id: 1, name: 'Product A', price: 10 },
    { id: 2, name: 'Product B', price: 20 },
  ]);
  const [currentOrder, setCurrentOrder] = useState(null); // Track the order being edited

  const handleAddOrEditOrder = (order) => {
    if (currentOrder) {
      // Update existing order
      setOrders(
        orders.map((o) =>
          o.id === currentOrder.id ? { ...currentOrder, ...order } : o
        )
      );
      setCurrentOrder(null); // Reset after editing
    } else {
      // Add new order
      const newOrder = { ...order, id: uuidv4() };
      setOrders([...orders, newOrder]);
    }
  };

  const handleEditOrder = (order) => {
    setCurrentOrder(order); // Set the current order for editing
  };

  const handleDeleteOrder = (id) => {
    setOrders(orders.filter((order) => order.id !== id));
  };

  return (
    <div>
      <SalesOrderForm
        products={products}
        onSubmit={handleAddOrEditOrder}
        initialData={currentOrder}
      />
      <SalesOrderList
        orders={orders}
        onEdit={handleEditOrder}
        onDelete={handleDeleteOrder}
      />
    </div>
  );
};

export default SalesOrders;
