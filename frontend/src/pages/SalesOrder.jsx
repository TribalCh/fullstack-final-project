import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SalesOrderForm from '../components/SalesOrderForm';
import SalesOrderList from '../components/SalesOrderList';

const SalesOrders = () => {
  const [orders, setOrders] = useState([]); // Sales orders list
  const [products, setProducts] = useState([]); // Products available for sale
  const [currentOrder, setCurrentOrder] = useState(null); // Order being edited
  const [error, setError] = useState(''); // Error handling state
  const [showForm, setShowForm] = useState(false); // Toggle form visibility

  // Fetch sales orders from the API
  const fetchSalesOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/salesorders/');
      setOrders(response.data);
    } catch (error) {
      setError('Error fetching sales orders: ' + error.message);
    }
  };

  // Fetch products from the API
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/products/');
      setProducts(response.data);
    } catch (error) {
      setError('Error fetching products: ' + error.message);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchSalesOrders();
    fetchProducts();
  }, []);

  // Handle adding or editing a sales order
  const handleAddOrEditOrder = async (order) => {
    try {
      if (currentOrder) {
        // Update existing sales order
        await axios.put(`http://localhost:8000/api/salesorders/${currentOrder.id}/`, order);
        setOrders(
          orders.map((o) => (o.id === currentOrder.id ? { ...currentOrder, ...order } : o))
        );
        setCurrentOrder(null); // Reset after editing
      } else {
        // Create new sales order
        const response = await axios.post('http://localhost:8000/api/salesorders/', order);
        setOrders([...orders, response.data]);
      }
      setShowForm(false); // Hide form after submission
    } catch (error) {
      setError('Error saving sales order: ' + error.message);
    }
  };

  // Handle editing a sales order
  const handleEditOrder = (order) => {
    setCurrentOrder(order);
    setShowForm(true); // Show form when editing an order
  };

  // Handle deleting a sales order
  const handleDeleteOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/salesorders/${id}/`);
      setOrders(orders.filter((order) => order.id !== id));
    } catch (error) {
      setError('Error deleting sales order: ' + error.message);
    }
  };

  // Toggle form visibility
  const toggleForm = () => {
    setShowForm((prev) => !prev);
    setCurrentOrder(null); // Reset current order when toggling form
  };

  return (
    <div>
      {error && <p className="error">{error}</p>}
      <button onClick={toggleForm}>
        {showForm ? 'Close Form' : 'Add Sales Order'}
      </button>
      {showForm && (
        <SalesOrderForm
          products={products}
          onSubmit={handleAddOrEditOrder}
          initialData={currentOrder}
        />
      )}
      <SalesOrderList
        orders={orders}
        onEdit={handleEditOrder}
        onDelete={handleDeleteOrder}
      />
    </div>
  );
};

export default SalesOrders;
