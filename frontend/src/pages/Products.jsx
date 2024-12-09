import React, { useState, useEffect } from 'react';
import ProductsForm from '../components/ProductsForm';
import ProductsList from '../components/ProductsList';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // For product categories
  const [currentProduct, setCurrentProduct] = useState(null);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility

  // Fetch products from the API
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/products/');
      setProducts(response.data);
      console.log(response.data);
    } catch (error) {
      setError('Error fetching products: ' + error.message);
    }
  };

  // Fetch product categories from the API
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/categories/');
      setCategories(response.data);
    } catch (error) {
      setError('Error fetching categories: ' + error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Handle adding or editing a product
  const handleAddProduct = async (product) => {
    try {
      if (currentProduct) {
        // Update existing product
        await axios.put(`http://localhost:8000/api/products/${currentProduct.id}/`, product);
        setProducts(products.map((p) => (p.id === currentProduct.id ? { ...currentProduct, ...product } : p)));
        setCurrentProduct(null);
      } else {
        // Create new product
        const response = await axios.post('http://localhost:8000/api/products/', product);
        setProducts([...products, response.data]);
      }
      setShowForm(false); // Hide form after submission
    } catch (error) {
      setError('Error saving product: ' + error.message);
    }
  };

  // Handle editing a product
  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setShowForm(true); // Show form when editing a product
  };

  // Handle deleting a product
  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/products/${id}/`);
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      setError('Error deleting product: ' + error.message);
    }
  };

  // Toggle form visibility
  const toggleForm = () => {
    setShowForm((prev) => !prev);
    setCurrentProduct(null); // Reset current product if showing form for adding a new one
  };

  return (
    <div>
      {error && <p className="error">{error}</p>}
      <button onClick={toggleForm}>
        {showForm ? 'Close Form' : 'Add Product'}
      </button>
      {showForm && (
        <ProductsForm
          onSubmit={handleAddProduct}
          initialData={currentProduct}
          categories={categories}
        />
      )}
      <ProductsList
        products={products}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
};

export default Products;
