import React, { useState, useEffect } from 'react';
import ProductsForm from '../components/ProductsForm';
import ProductsList from '../components/ProductsList';

const Products = () => {
  const [products, setProducts] = useState([]);

  // Load products from localStorage on component mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  // Save products to localStorage whenever they are updated
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const handleAddProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      price: parseFloat(product.price),
      quantity: parseInt(product.quantity, 10),
    };
    setProducts([...products, newProduct]);
  };

  const handleEditProduct = (product) => {
    setProducts(
      products.map((p) =>
        p.id === product.id ? { ...product } : p
      )
    );
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <div>
      <h1>Products Manager</h1>
      <ProductsForm onSubmit={handleAddProduct} />
      <ProductsList
        products={products}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
};

export default Products;
