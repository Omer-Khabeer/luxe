"use client";
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image?: any;
  slug?: { current: string };
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: { id: string; size: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; size: string; quantity: number } }
  | { type: 'CLEAR_CART' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newItems: CartItem[] = [];

  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(
        item => item.id === action.payload.id && item.size === action.payload.size
      );
      
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === action.payload.id && item.size === action.payload.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }
      break;

    case 'REMOVE_ITEM':
      newItems = state.items.filter(item => 
        !(item.id === action.payload.id && item.size === action.payload.size)
      );
      break;

    case 'UPDATE_QUANTITY':
      newItems = state.items.map(item =>
        item.id === action.payload.id && item.size === action.payload.size
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      break;

    case 'CLEAR_CART':
      newItems = [];
      break;

    default:
      return state;
  }

  return {
    items: newItems,
    total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
  };
};

const CartContext = createContext<{
  state: CartState;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
} | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0
  });

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string, size: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id, size } });
  };

  const updateQuantity = (id: string, size: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, size, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{
      state,
      addItem,
      removeItem,
      updateQuantity,
      clearCart
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