import React from 'react';

const ProductsList = ({ products, onEdit, onDelete }) => {
  return (
    <div>
      <h3>Products List</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {products.map((product) => (
          <li
            key={product.id}
            style={{
              marginBottom: '10px',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          >
            <strong>{product.name}</strong>  ₱{product.price.toFixed(2)} ({product.quantity} available)
            <div style={{ marginTop: '5px' }}>
              <button
                onClick={() => onEdit(product)}
                style={{ marginRight: '10px' }}
              >
                Edit
              </button>
              <button onClick={() => onDelete(product.id)} style={{ color: 'white' }}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsList;
