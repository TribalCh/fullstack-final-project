import React, { useState, useEffect } from 'react';

const SalesOrderForm = ({ products, onSubmit, initialData }) => {
  const [order, setOrder] = useState({ productId: '', quantity: '' });

  // Populate form fields when editing
  useEffect(() => {
    if (initialData) {
      setOrder(initialData);
    } else {
      setOrder({ productId: '', quantity: '' });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder({ ...order, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!order.productId || order.quantity <= 0) {
      alert('Please select a product and enter a valid quantity.');
      return;
    }
    const product = products.find((p) => p.id === parseInt(order.productId));
    const total = product.unit_price * order.quantity;
    const postData = { ...order, productName: product.name, price: product.unit_price, total};
    onSubmit({ ...order, productName: product.name, price: product.unit_price, total });
    setOrder({ productId: '', quantity: '' });
    console.log(postData)
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{initialData ? 'Edit Sales Order' : 'Create Sales Order'}</h3>
      <label>
        Product:
        <select
          name="productId"
          value={order.productId}
          onChange={handleChange}
          required
        >
          <option value="">Select a product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} - ₱{product.unit_price}
            </option>
          ))}
        </select>
      </label>
      <label>
        Quantity:
        <input
          type="number"
          name="quantity"
          value={order.quantity}
          onChange={handleChange}
          required
          min="1"
        />
      </label>
      <button type="submit">{initialData ? 'Update Order' : 'Add Order'}</button>
    </form>
  );
};

export default SalesOrderForm;
