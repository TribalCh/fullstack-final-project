// OrderModal.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderModal = ({ orderId, onClose }) => {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/salesorders/${orderId}/`);
        // Ensure items is always an array
        setOrder({
          ...response.data,
          items: Array.isArray(response.data.items) ? response.data.items : [], // Fallback if items is undefined
        });
      } catch (error) {
        setError('Error fetching order details: ' + error.message);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!order) {
    return <p>Loading...</p>;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
        zIndex: 1000,
      }}
    >
      <h4>Sales Order Details</h4>
      <p><strong>Order ID:</strong> {order.order_id}</p>
      <p><strong>Customer Name:</strong> {order.customer_name}</p>
      <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleDateString()}</p>
      <p><strong>Total Amount:</strong> ₱{Number(order.total_amount).toFixed(2)}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <h5>Order Items:</h5>
      {order.items.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {order.items.map((item) => (
            <li key={item.id} style={{ marginBottom: '10px' }}>
              <strong>{item.product_name}</strong> - ₱{Number(item.unit_price).toFixed(2)} x {item.quantity}
              <br />
              <strong>Subtotal:</strong> ₱{Number(item.subtotal).toFixed(2)}
            </li>
          ))}
        </ul>
      ) : (
        <p>No items found for this order.</p>
      )}
      <button onClick={onClose} style={{ marginTop: '10px' }}>
        Close
      </button>
    </div>
  );
};

export default OrderModal;
