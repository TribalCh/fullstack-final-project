import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductsForm = ({ onSubmit, initialData, categories }) => {
  const [products, setProducts] = useState([
    {
      name: '',
      category: '',
      brand: '',
      sku: '',
      unit_price: '',
      stock_quantity: '',
      is_perishable: false,
      expiration_date: '',
      submitted: false,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setProducts([
        {
          ...initialData,
          unit_price: initialData.unit_price.toString(),
          stock_quantity: initialData.stock_quantity.toString(),
          category: initialData.category ? initialData.category.id : '',
          submitted: false,
        },
      ]);
    }
  }, [initialData]);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...products];
    updatedProducts[index][name] = name === 'category' && value !== '' ? parseInt(value, 10) : value;
    setProducts(updatedProducts);
  };

  const handleCheckboxChange = (index, e) => {
    const updatedProducts = [...products];
    updatedProducts[index].is_perishable = e.target.checked;
    setProducts(updatedProducts);
  };

  const handleSubmitSingleProduct = async (index) => {
    const product = products[index];
    console.log('Form Data:', product);

    if (!product.name || !product.sku || !product.unit_price || !product.stock_quantity) {
      setError('Please fill out all required fields for each product.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = {
        ...product,
        category: product.category ? parseInt(product.category, 10) : null,
        unit_price: parseFloat(product.unit_price),
        stock_quantity: parseInt(product.stock_quantity, 10),
        expiration_date: product.expiration_date ? new Date(product.expiration_date).toISOString().split('T')[0] : null,
        stock_logs: [],
      };
      console.log('Processed Form Data:', formData);

      if (initialData) {
        await axios.put(`http://localhost:8000/api/products/${initialData.id}/`, formData);
      } else {
        await axios.post('http://localhost:8000/api/products/', formData);
      }

      const updatedProducts = [...products];
      updatedProducts[index].submitted = true;
      setProducts(updatedProducts);
      onSubmit();
    } catch (error) {
      console.error('Error adding product:', error);
      if (error.response) {
        if (error.response.status === 400) {
          setError('Invalid input. Please check the fields and try again.');
        } else if (error.response.status === 409) {
          setError('A product with this SKU already exists. Please use a different SKU.');
        } else {
          setError('An error occurred on the server. Please try again later.');
        }
      } else if (error.request) {
        setError('No response from the server. Please check your network connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <h3>{initialData ? 'Edit Product' : 'Add Product'}</h3>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      {products.map((product, index) => (
        !product.submitted && (
          <div key={index}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={(e) => handleChange(index, e)}
              required
            />
            <label>Category:</label>
            <select
              name="category"
              value={product.category}
              onChange={(e) => handleChange(index, e)}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <label>Brand:</label>
            <input
              type="text"
              name="brand"
              value={product.brand}
              onChange={(e) => handleChange(index, e)}
            />
            <label>SKU:</label>
            <input
              type="text"
              name="sku"
              value={product.sku}
              onChange={(e) => handleChange(index, e)}
              required
            />
            <label>Unit Price:</label>
            <input
              type="number"
              name="unit_price"
              value={product.unit_price}
              onChange={(e) => handleChange(index, e)}
              required
            />
            <label>Quantity:</label>
            <input
              type="number"
              name="stock_quantity"
              value={product.stock_quantity}
              onChange={(e) => handleChange(index, e)}
              required
            />
            <label>Perishable:</label>
            <input
              type="checkbox"
              name="is_perishable"
              checked={product.is_perishable}
              onChange={(e) => handleCheckboxChange(index, e)}
            />
            <label>Expiration Date:</label>
            <input
              type="date"
              name="expiration_date"
              value={product.expiration_date}
              onChange={(e) => handleChange(index, e)}
            />
            <button
              type="button"
              onClick={() => handleSubmitSingleProduct(index)}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Add Product'}
            </button>
          </div>
        )
      ))}
    </form>
  );
};

export default ProductsForm;
