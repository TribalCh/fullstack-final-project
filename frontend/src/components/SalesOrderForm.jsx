import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SalesOrderForm = ({ products, categories, onSubmit, initialData }) => {
  const [order, setOrder] = useState({
    customerName: '',
    paymentMethod: 'Cash',
    cartItems: [],
    submitted: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialData && initialData.cartItems && Array.isArray(initialData.cartItems)) {
      setOrder({
        ...initialData,
        submitted: false,
        cartItems: initialData.cartItems.map(item => ({
          productId: item.product ? item.product.id.toString() : '',
          quantity: item.quantity ? item.quantity.toString() : '',
          priceAtPurchase: item.price_at_purchase || '',
        })),
      });
    } else {
      setOrder({
        customerName: '',
        paymentMethod: 'Cash',
        cartItems: [],
        submitted: false,
      });
    }
  }, [initialData]);

  useEffect(() => {
    // Automatically set priceAtPurchase based on the product's unit price when productId changes
    const updatedCartItems = order.cartItems.map((item, index) => {
      if (item.productId) {
        const product = products.find(p => p.id === parseInt(item.productId));
        if (product && !item.priceAtPurchase) {
          item.priceAtPurchase = product.unit_price.toString();
        }
      }
      return item;
    });
    setOrder({ ...order, cartItems: updatedCartItems });
  }, [products, order.cartItems]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder({ ...order, [name]: value });
  };

  const handleCartChange = (index, e) => {
    const { name, value } = e.target;
    const newCartItems = [...order.cartItems];
    newCartItems[index] = {
      ...newCartItems[index],
      [name]: value,
    };

    // Automatically set priceAtPurchase if a product is selected
    if (name === 'productId' && value) {
      const product = products.find(p => p.id === parseInt(value));
      if (product) {
        newCartItems[index].priceAtPurchase = product.unit_price.toString();
      }
    }

    setOrder({ ...order, cartItems: newCartItems });
  };

  const handleAddCartItem = () => {
    setOrder({ ...order, cartItems: [...order.cartItems, { productId: '', quantity: '', priceAtPurchase: '' }] });
  };

  const handleRemoveCartItem = (index) => {
    const newCartItems = order.cartItems.slice();
    newCartItems.splice(index, 1);
    setOrder({ ...order, cartItems: newCartItems });
  };

  const calculateTotal = () => {
    return order.cartItems.reduce((total, item) => {
      const price = parseFloat(item.priceAtPurchase) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return total + (price * quantity);
    }, 0).toFixed(2); // Formats to 2 decimal places
  };

  const updateProductStock = async () => {
    try {
      for (const item of order.cartItems) {
        const productId = parseInt(item.productId);
        const quantityToDeduct = parseInt(item.quantity);

        // Fetch the product's current stock
        const response = await axios.get(`http://localhost:8000/api/products/${productId}/`);
        const currentStock = response.data.stock_quantity;

        // Check if sufficient stock is available
        if (currentStock >= quantityToDeduct) {
          // Update product stock
          await axios.put(`http://localhost:8000/api/products/${productId}/`, {
            stock_quantity: currentStock - quantityToDeduct,
          });
        } else {
          throw new Error(`Not enough stock for product ${productId}`);
        }
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      throw error;
    }
  };

  const addCartItem = async (item) => {
    try {
      const postData = {
        product: parseInt(item.productId),  // Ensure this is an integer if needed by the backend
        quantity: parseInt(item.quantity),  // Ensure this is an integer if needed
        price_at_purchase: parseFloat(item.priceAtPurchase),  // Ensure this is a number
      };

      console.log('Adding cart item:', postData); // Debug log

      const response = await axios.post('http://localhost:8000/api/carts/', postData);
      console.log('Cart item added successfully:', response.data);
    } catch (error) {
      console.error('Error adding cart item:', error);
      console.error('Error details:', error.response?.data);  // Log additional response details if available
      throw error; // Re-throw to be caught in handleSubmit
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!order.customerName || order.cartItems.length === 0) {
      setError('Please provide a customer name and add items to the cart.');
      return;
    }

    const invalidItem = order.cartItems.find(item => !item.productId || item.quantity <= 0);
    if (invalidItem) {
      setError('All cart items must have a valid product and quantity.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Submit the sales order first
      const postData = {
        customer_name: order.customerName,
        payment_method: order.paymentMethod,
        cart_items: order.cartItems.map(item => ({
          product: parseInt(item.productId),
          quantity: parseInt(item.quantity),
          price_at_purchase: parseFloat(item.priceAtPurchase),
        })),
      };

      console.log('Submitting sales order:', postData); // Debug log
      const response = await axios.post('http://localhost:8000/api/salesorders/', postData);
      console.log('Sales order submitted successfully:', response.data); // Debug log

      // Add each cart item to the database after the sales order is submitted
      for (const item of order.cartItems) {
        await addCartItem(item);
      }

      // Update the stock after adding all cart items successfully
      await updateProductStock();

      // Reset the form after successful submission
      setOrder({
        customerName: '',
        paymentMethod: 'Cash',
        cartItems: [],
        submitted: true,
      });

      onSubmit();
    } catch (error) {
      console.error('Error adding sales order:', error);
      setError('An error occurred while processing the order. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{initialData ? 'Edit Sales Order' : 'Create Sales Order'}</h3>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <label>
        Customer Name:
        <input
          type="text"
          name="customerName"
          value={order.customerName}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Payment Method:
        <select
          name="paymentMethod"
          value={order.paymentMethod}
          onChange={handleChange}
        >
          <option value="Cash">Cash</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Debit Card">Debit Card</option>
          <option value="Digital Wallet">Digital Wallet</option>
        </select>
      </label>
      <h4>Cart Items:</h4>
      {order.cartItems.map((item, index) => (
        <div key={index}>
          <label>
            Product:
            <select
              name="productId"
              value={item.productId}
              onChange={(e) => handleCartChange(index, e)}
              required
            >
              <option value="">Select a product</option>
              {products && Array.isArray(products) && products.map((product) => (
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
              value={item.quantity}
              onChange={(e) => handleCartChange(index, e)}
              required
              min="1"
            />
          </label>
          <label>
            Price at Purchase:
            <input
              type="number"
              name="priceAtPurchase"
              value={item.priceAtPurchase}
              onChange={(e) => handleCartChange(index, e)}
              required
              step="0.01"
              min="0"
            />
          </label>
          <button type="button" onClick={() => handleRemoveCartItem(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={handleAddCartItem}>Add Item</button>
      <h4>Total: ₱{calculateTotal()}</h4>
      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default SalesOrderForm;
