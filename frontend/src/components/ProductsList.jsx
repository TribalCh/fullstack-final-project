// ProductsList.jsx
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
                <button
                  onClick={() => onEdit(product)}
                  style={{ marginRight: '10px' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  style={{ color: 'white', backgroundColor: 'red', border: 'none', padding: '5px', borderRadius: '3px' }}
                >
                  Delete
                </button>
                <button
                  onClick={() => viewProduct(product.id)}
                  style={{ marginLeft: '10px' }}
                >
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
