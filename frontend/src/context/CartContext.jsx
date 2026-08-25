import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('mhp_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('mhp_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const foodTypeIcon = (type) => (type === 'Non-Veg' ? 'Non-Veg' : 'Veg');

  const addToCart = (foodItem, selectedOption = null) => {
    setCartItems(prev => {
      const optionLabel = selectedOption ? selectedOption.label : null;
      const unitPrice = selectedOption ? selectedOption.price : (foodItem.price || foodItem.unitPrice || 0);
      const cartId = `${foodItem._id || foodItem.foodId}-${optionLabel || 'default'}`;

      const existingIndex = prev.findIndex(item => item.cartId === cartId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [
          ...prev,
          {
            cartId,
            foodId: foodItem._id || foodItem.foodId,
            _id: foodItem._id || foodItem.foodId,
            name: foodItem.name,
            category: foodItem.category,
            foodType: foodTypeIcon(foodItem.foodType),
            rawFoodType: foodItem.foodType,
            image: foodItem.image,
            selectedOptionLabel: optionLabel,
            unitPrice,
            price: unitPrice,
            quantity: 1
          }
        ];
      }
    });
  };

  const removeFromCart = (cartId) => {
    setCartItems(prev => prev.filter(item => {
      const matches = item.cartId === cartId || item.foodId === cartId || item._id === cartId;
      return !matches;
    }));
  };

  const updateQuantity = (cartId, delta) => {
    setCartItems(prev => {
      return prev.map(item => {
        const matches = item.cartId === cartId || item.foodId === cartId || item._id === cartId;
        if (matches) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartAmount = cartItems.reduce((acc, item) => acc + ((item.unitPrice || item.price || 0) * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalCartCount,
      totalCartAmount
    }}>
      {children}
    </CartContext.Provider>
  );
};
