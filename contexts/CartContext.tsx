import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext<any>(null);

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }: any) {
  const [cartItems, setCartItems] = useState<any[]>([]);

  const addItemToCart = (item: any) => {
    setCartItems((prevItems) => {
      const itemExists = prevItems.find((i) => i.id === item.id);
      if (itemExists) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      }

      return [...prevItems, { ...item, qty: 1 }];
    });
  };

  const removeItemFromCart = (item: any) => {
    setCartItems((prevItems) => {
      console.log(cartItems)
      return prevItems.filter((i) => i.id !== item.id)
    }
    );

  };

  const clearCart = () => {
    setCartItems([])
  }

  const updateItemQty = (id: string, qty: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, qty) } : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, addItemToCart, removeItemFromCart, updateItemQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
