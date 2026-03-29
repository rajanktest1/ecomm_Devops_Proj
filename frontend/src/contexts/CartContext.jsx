import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = useCallback(async () => {
    try {
      const res = await fetch('/api/cart');
      if (!res.ok) return;
      const data = await res.json();
      setCartCount(data.items.reduce((sum, item) => sum + item.quantity, 0));
    } catch {
      // network error — leave count as-is
    }
  }, []);

  // Load count on mount
  useEffect(() => { refreshCartCount(); }, [refreshCartCount]);

  return (
    <CartContext.Provider value={{ cartCount, refreshCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
