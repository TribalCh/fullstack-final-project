import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SalesOrderForm from './SalesOrderForm'; // Import the form component
import OrderModal from './OrderModal';

const SalesOrderList = ({ orders, products, categories, onEdit, onDelete }) => {
  const [selectedOrderData, setSelectedOrderData] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const editOrder = (order) => {
    setSelectedOrderData(order);
    setShowEditForm(true);
  };

  const closeModal = () => {
    setShowEditForm(false);
    setSelectedOrderData(null);
  };

  // Base button style
  const buttonStyle = {
    padding: '5px 10px',
    border: 'none',
    borderRadius: '5px',
    color: 'white',
    cursor: 'pointer',
    marginRight: '10px',
  };

  // Specific button styles
  const blueButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#007BFF', // Blue color for Edit and View buttons
  };

  const redButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#FF4D4D', // Red color for Delete button
  };

  const viewOrder = (orderId) => {
    // Navigate to the OrderDetailsPage with the orderId as a URL parameter
    navigate(`/order-details/${orderId}`);
  };

  return (
    <div>
      <h3>Sales Orders List</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {orders.map((order) => (
          <li
            key={order.order_id}
            style={{
              marginBottom: '10px',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          >
            <strong>Order ID:</strong> {order.order_id} <br />
            <strong>Customer:</strong> {order.customer_name} <br />
            <strong>Total:</strong> ₱{Number(order.total_amount).toFixed(2)}
            <div style={{ marginTop: '5px' }}>
              <button onClick={() => editOrder(order)} style={blueButtonStyle}>
                Edit
              </button>
              <button onClick={() => onDelete(order.order_id)} style={redButtonStyle}>
                Delete
              </button>
              <button onClick={() => viewOrder(order.order_id)} style={blueButtonStyle}>
                View
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showEditForm && selectedOrderData && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
          }}
          onClick={closeModal}
        >
          <SalesOrderForm
            products={products}
            categories={categories}
            initialData={selectedOrderData}
            onSubmit={closeModal} // Close form after submission
          />
        </div>
      )}
    </div>
  );
};

export default SalesOrderList;
