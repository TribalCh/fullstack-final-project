import React, { useState, useEffect } from 'react';

const ProductsForm = ({ onSubmit, initialData }) => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
  });

  useEffect(() => {
    if (initialData) {
      setProduct(initialData); // Prefill form when editing
    } else {
      setProduct({ name: '', description: '', price: '', quantity: '' }); // Reset form
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(product); // Pass data to parent
    setProduct({ name: '', description: '', price: '', quantity: '' }); // Reset form
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{initialData ? 'Edit Product' : 'Add Product'}</h3>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Description:
        <input
          type="text"
          name="description"
          value={product.description}
          onChange={handleChange}
        />
      </label>
      <label>
        Price:
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Quantity:
        <input
          type="number"
          name="quantity"
          value={product.quantity}
          onChange={handleChange}
          required
        />
      </label>
      <button type="submit">{initialData ? 'Update Product' : 'Add Product'}</button>
    </form>
  );
};

export default ProductsForm;
