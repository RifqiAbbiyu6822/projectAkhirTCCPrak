import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (camera) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.camera_id === camera.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.camera_id === camera.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevItems, {
        camera_id: camera.id,
        camera: camera,
        quantity: 1,
        total_price: camera.price,
        created_at: new Date().toISOString()
      }];
    });
  };

  const removeFromCart = (cameraId) => {
    setCartItems(prevItems => prevItems.filter(item => item.camera_id !== cameraId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const updateQuantity = (cameraId, quantity) => {
    if (quantity < 1) return;

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.camera_id === cameraId
          ? { 
              ...item, 
              quantity: quantity,
              total_price: item.camera.price * quantity 
            }
          : item
      )
    );
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + Number(item.total_price), 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      updateQuantity,
      getCartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 