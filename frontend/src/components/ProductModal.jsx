// ProductModal.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductModal = ({ productId, onClose }) => {
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/products/${productId}/`);
        setProduct(response.data);
      } catch (error) {
        setError('Error fetching product details: ' + error.message);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!product) {
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
      <h4>Product Details</h4>
      <p><strong>Name:</strong> {product.name}</p>
      <p><strong>Category:</strong> {product.category_name}</p>
      <p><strong>Brand:</strong> {product.brand}</p>
      <p><strong>SKU:</strong> {product.sku}</p>
      <p><strong>Unit Price:</strong> ₱{isNaN(Number(product.unit_price)) ? 'N/A' : Number(product.unit_price).toFixed(2)}</p>
      <p><strong>Stock Quantity:</strong> {product.stock_quantity}</p>
      <p><strong>Perishable:</strong> {product.is_perishable ? 'Yes' : 'No'}</p>
      <p><strong>Expiration Date:</strong> {product.expiration_date || 'N/A'}</p>
      <button onClick={onClose} style={{ marginTop: '10px' }}>
        Close
      </button>
    </div>
  );
};

export default ProductModal;
