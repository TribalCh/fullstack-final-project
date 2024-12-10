import React, { useState } from 'react';
import ProductModal from './ProductModal';

const ProductsList = ({ products, onEdit, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const viewProduct = (productId) => {
    setSelectedProductId(productId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProductId(null);
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

  return (
    <div>
      <h3>Products List</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {products.map((product) => {
          const price = product.unit_price !== undefined ? product.unit_price : 0;

          return (
            <li
              key={product.id}
              style={{
                marginBottom: '10px',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
              }}
            >
              <strong>{product.name}</strong> ₱{Number(price).toFixed(2)} ({product.stock_quantity} available)
              <div style={{ marginTop: '5px' }}>
                <button onClick={() => onEdit(product)} style={blueButtonStyle}>
                  Edit
                </button>
                <button onClick={() => onDelete(product.id)} style={redButtonStyle}>
                  Delete
                </button>
                <button onClick={() => viewProduct(product.id)} style={blueButtonStyle}>
                  View
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {showModal && selectedProductId && (
        <ProductModal productId={selectedProductId} onClose={closeModal} />
      )}

      {showModal && (
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
        />
      )}
    </div>
  );
};

export default ProductsList;
