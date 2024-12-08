import React from 'react';

const SalesOrderList = ({ orders, onEdit, onDelete }) => {
  return (
    <div>
      <h3>Sales Orders</h3>
      {orders.length === 0 ? (
        <p>No sales orders have been created yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {orders.map((order) => (
            <li
              key={order.id}
              style={{
                marginBottom: '10px',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
              }}
            >
              <strong>{order.productName}</strong>  ₱{order.price.toFixed(2)} x {order.quantity}
              <br />
              <strong>Total: </strong>₱{order.total.toFixed(2)}
              <div style={{ marginTop: '5px' }}>
                <button onClick={() => onEdit(order)} style={{ marginRight: '10px' }}>
                  Edit
                </button>
                <button onClick={() => onDelete(order.id)} style={{ color: 'white' }}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SalesOrderList;
