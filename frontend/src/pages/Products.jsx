import React, { useState, useEffect } from 'react';
import ProductsForm from '../components/ProductsForm';
import ProductsList from '../components/ProductsList';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Product A', description: 'Desc A', price: 10, quantity: 100 },
    { id: 2, name: 'Product B', description: 'Desc B', price: 20, quantity: 50 },
  ]);
  const [currentProduct, setCurrentProduct] = useState(null); // Track the product being edited
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/products/')
      console.log(response.data)
    } catch (error) {
      setError('Error fetching products: ' + error.message);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = (product) => {
    if (currentProduct) {
      // Edit product
      setProducts(
        products.map((p) =>
          p.id === currentProduct.id ? { ...currentProduct, ...product } : p
        )
      );
      setCurrentProduct(null); // Reset editing state
    } else {
      // Add new product
      const newProduct = {
        ...product,
        id: Date.now(),
        price: parseFloat(product.price),
        quantity: parseInt(product.quantity, 10),
      };
      setProducts([...products, newProduct]);
    }
  };

  const handleEditProduct = (product) => {
    setCurrentProduct(product); // Set product for editing
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <div>
      <ProductsForm onSubmit={handleAddProduct} initialData={currentProduct} />
      <ProductsList
        products={products}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
};

export default Products;
