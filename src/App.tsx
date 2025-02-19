import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import client  from './apolloClient';
import Header from './components/Header';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import CartOverlay from './components/CartOverlay';
import { usePlaceOrder } from './hooks/usePlaceOrder';
import { CartItem } from './cart.types';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState<boolean>(false);
  const placeOrderMutation = usePlaceOrder();

  const addToCart = (item: CartItem) => {
    // Check if same product with same options exists; if so, increase quantity.
    const index = cartItems.findIndex(
      (cartItem) =>
        cartItem.id === item.id &&
        JSON.stringify(cartItem.selectedOptions) === JSON.stringify(item.selectedOptions)
    );
    if (index !== -1) {
      const newCart = [...cartItems];
      newCart[index].quantity += 1;
      setCartItems(newCart);
    } else {
      setCartItems([...cartItems, item]);
    }
  };

  const increaseQuantity = (index: number) => {
    const newCart = [...cartItems];
    newCart[index].quantity += 1;
    setCartItems(newCart);
  };

  const decreaseQuantity = (index: number) => {
    const newCart = [...cartItems];
    if (newCart[index].quantity === 1) {
      newCart.splice(index, 1);
    } else {
      newCart[index].quantity -= 1;
    }
    setCartItems(newCart);
  };

  const placeOrder = async () => {
    const success = await placeOrderMutation(cartItems);
    if (success) {
      setCartItems([]);
      alert('Order placed successfully!');
    } else {
      alert('Failed to place order.');
    }
  };

  const deleteItem = (index: number) => {
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    setCartItems(newCart);
  };

  const updateSelectedOption = (itemIndex: number, attributeName: string, optionValue: string) => {
    const newCart = [...cartItems];
    // Update the selectedOptions for the cart item
    newCart[itemIndex].selectedOptions = {
      ...newCart[itemIndex].selectedOptions,
      [attributeName]: optionValue,
    };
    setCartItems(newCart);
  };

  

  return (
    <ApolloProvider client={client}>
      <Router>
        <Header
          toggleCart={() => setCartOpen(!isCartOpen)}
          cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        <CartOverlay
          isOpen={isCartOpen}
          onClose={() => setCartOpen(false)}
          cartItems={cartItems}
          increaseQuantity={increaseQuantity}
          decreaseQuantity={decreaseQuantity}
          deleteItem={deleteItem}
          placeOrder={placeOrder}
          updateSelectedOption={updateSelectedOption}
        />
        <Routes>
          <Route path="/" element={<ProductList activeCategory={activeCategory} addToCart={addToCart} />} />
          <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
};

export default App;
