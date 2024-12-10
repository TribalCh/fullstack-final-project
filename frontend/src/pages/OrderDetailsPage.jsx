import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/salesorders/${orderId}/`);
        console.log('Order API Response:', response.data);
        setOrder(response.data);
      } catch (error) {
        setError('Error fetching order details: ' + error.message);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  // Fetch cart items
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/carts/order/${orderId}/`);
        console.log('Cart Items API Response:', response.data);
        setCartItems(response.data);
      } catch (error) {
        console.warn('Error fetching cart items:', error.message);
        // Only log the error, don't set it in the main error state.
      }
    };

    if (orderId) {
      fetchCartItems();
    }
  }, [orderId]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!order) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h4>Sales Order Details</h4>
      <p><strong>Order ID:</strong> {order.id}</p>
      <p><strong>Customer Name:</strong> {order.customer_name}</p>
      <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleDateString()}</p>
      <p><strong>Total Amount:</strong> ₱{!isNaN(Number(order.total_amount)) ? Number(order.total_amount).toFixed(2) : 'Invalid'}</p>
      <p><strong>Status:</strong> {order.status}</p>

      <h5>Order Items:</h5>
      {Array.isArray(order.order_items) && order.order_items.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {order.order_items.map((item) => {
            const unitPrice = Number(item.product.unit_price);
            const quantity = Number(item.quantity);
            const subtotal = Number(item.total_price);

            return (
              <li key={item.id} style={{ marginBottom: '10px' }}>
                <strong>{item.product.name}</strong> - ₱{!isNaN(unitPrice) ? unitPrice.toFixed(2) : 'Invalid'} x {quantity}
                <br />
                <strong>Subtotal:</strong> ₱{!isNaN(subtotal) ? subtotal.toFixed(2) : 'Invalid'}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No items found for this order.</p>
      )}

      <h5>Cart Items:</h5>
      {Array.isArray(cartItems) && cartItems.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {cartItems.map((item) => (
            <li key={item.id} style={{ marginBottom: '10px' }}>
              <strong>{item.product.name}</strong> - Quantity: {item.quantity}
              <br />
              <strong>Price per Unit:</strong> ₱{!isNaN(Number(item.product.unit_price)) ? Number(item.product.unit_price).toFixed(2) : 'Invalid'}
            </li>
          ))}
        </ul>
      ) : (
        <p>No cart items found.</p>
      )}

      <button onClick={() => navigate(-1)} style={{ marginTop: '10px' }}>
        Back
      </button>
    </div>
  );
};

export default OrderDetailsPage;
