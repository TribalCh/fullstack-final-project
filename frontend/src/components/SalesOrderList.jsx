import React, { useState } from 'react';
import SalesOrderForm from './SalesOrderForm'; // Import the form component
import OrderModal from './OrderModal';

const SalesOrderList = ({ orders, products, categories, onEdit, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrderData, setSelectedOrderData] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const viewOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setShowModal(true);
  };

  const editOrder = (order) => {
    setSelectedOrderData(order);
    setShowEditForm(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrderId(null);
    setShowEditForm(false);
    setSelectedOrderData(null);
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
              <button
                onClick={() => editOrder(order)}
                style={{ marginRight: '10px' }}
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(order.order_id)}
                style={{
                  color: 'white',
                  backgroundColor: 'red',
                  border: 'none',
                  padding: '5px',
                  borderRadius: '3px',
                }}
              >
                Delete
              </button>
              <button
                onClick={() => viewOrder(order.order_id)}
                style={{ marginLeft: '10px' }}
              >
                View
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showModal && selectedOrderId && (
        <OrderModal orderId={selectedOrderId} onClose={closeModal} />
      )}

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
