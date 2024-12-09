import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductsForm = ({ onSubmit, initialData, categories }) => {
  const [product, setProduct] = useState({
    name: '',
    category: '',
    brand: '',
    sku: '',
    unit_price: '',
    stock_quantity: '',
    is_perishable: false,
    expiration_date: '',
  });

  useEffect(() => {
    if (initialData) {
      setProduct({
        ...initialData,
        unit_price: initialData.unit_price.toString(),
        stock_quantity: initialData.stock_quantity.toString(),
        category: initialData.category ? initialData.category.id : '', // Ensure category is set properly
      });
    } else {
      setProduct({
        name: '',
        category: '',
        brand: '',
        sku: '',
        unit_price: '',
        stock_quantity: '',
        is_perishable: false,
        expiration_date: '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'category') {
      // Only set category if it's a valid number or empty
      setProduct({ ...product, [name]: value !== '' ? parseInt(value, 10) : '' });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleCheckboxChange = (e) => {
    setProduct({ ...product, is_perishable: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Debugging step: Log form data before submission
    console.log('Form Data:', product);

    // Ensure valid data before submission
    if (!product.unit_price || isNaN(product.unit_price)) {
      alert('Please enter a valid unit price.');
      return;
    }
    if (!product.stock_quantity || isNaN(product.stock_quantity)) {
      alert('Please enter a valid stock quantity.');
      return;
    }

    const formData = {
      ...product,
      category: product.category ? parseInt(product.category, 10) : null,
      unit_price: parseFloat(product.unit_price),
      stock_quantity: parseInt(product.stock_quantity, 10),
      expiration_date: product.expiration_date ? new Date(product.expiration_date).toISOString().split('T')[0] : null,
    };

    try {
      if (initialData) {
        await axios.put(`http://localhost:8000/api/products/${initialData.id}/`, formData);
      } else {
        await axios.post('http://localhost:8000/api/products/', formData);
      }
      onSubmit();
      setProduct({
        name: '',
        category: '',
        brand: '',
        sku: '',
        unit_price: '',
        stock_quantity: '',
        is_perishable: false,
        expiration_date: '',
      });
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        alert(`Error: ${error.response.data.detail || 'An error occurred while saving the product. Please try again.'}`);
      } else {
        console.error('Error submitting product:', error);
        alert('An error occurred while saving the product. Please try again.');
      }
    }
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
        Category:
        <select
          name="category"
          value={product.category}
          onChange={handleChange}
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Brand:
        <input
          type="text"
          name="brand"
          value={product.brand}
          onChange={handleChange}
        />
      </label>
      <label>
        SKU:
        <input
          type="text"
          name="sku"
          value={product.sku}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Unit Price:
        <input
          type="number"
          name="unit_price"
          value={product.unit_price}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Quantity:
        <input
          type="number"
          name="stock_quantity"
          value={product.stock_quantity}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Perishable:
        <input
          type="checkbox"
          name="is_perishable"
          checked={product.is_perishable}
          onChange={handleCheckboxChange}
        />
      </label>
      <label>
        Expiration Date:
        <input
          type="date"
          name="expiration_date"
          value={product.expiration_date}
          onChange={handleChange}
        />
      </label>
      <button type="submit">{initialData ? 'Update Product' : 'Add Product'}</button>
    </form>
  );
};

export default ProductsForm;
