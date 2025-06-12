import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [tableNumber, setTableNumber] = useState('');

  // AsyncStorage 키
  const CART_KEY = 'CART_ITEMS';
  const TABLE_KEY = 'TABLE_NUMBER';

  // AsyncStorage에서 데이터 로드
  useEffect(() => {
    const loadCartData = async () => {
      try {
        const storedCart = await AsyncStorage.getItem(CART_KEY);
        const storedTableNumber = await AsyncStorage.getItem(TABLE_KEY);

        if (storedCart) {
          setCart(JSON.parse(storedCart)); // 저장된 카트를 복원
        }
        if (storedTableNumber) {
          setTableNumber(storedTableNumber); // 저장된 테이블 번호를 복원
        }
      } catch (error) {
        console.error('Failed to load cart or table number:', error);
      }
    };

    loadCartData();
  }, []);

  // AsyncStorage에 데이터 저장
  const saveCartData = async (updatedCart) => {
    try {
      await AsyncStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
    } catch (error) {
      console.error('Failed to save cart data:', error);
    }
  };

  const saveTableNumber = async (number) => {
    try {
      await AsyncStorage.setItem(TABLE_KEY, number);
    } catch (error) {
      console.error('Failed to save table number:', error);
    }
  };

  // 카트에 아이템 추가
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id);
      let updatedCart;

      if (existingItemIndex !== -1) {
        updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += item.quantity;
      } else {
        updatedCart = [...prevCart, item];
      }

      saveCartData(updatedCart); // 업데이트된 카트를 저장
      return updatedCart;
    });
  };

  // 아이템 수량 업데이트
  const updateQuantity = (id, quantity) => {
    if (id === null) {
      setCart([]); // 모든 아이템 제거
      saveCartData([]); // 비워진 카트를 저장
      return;
    }
    setCart((prevCart) => {
      const updatedCart = prevCart.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      saveCartData(updatedCart); // 업데이트된 카트를 저장
      return updatedCart;
    });
  };

  // 아이템 삭제
  const removeItem = (id) => {
    if (id === null) {
      setCart([]); // 카트 초기화
      saveCartData([]); // 비워진 카트를 저장
      return;
    }
    setCart((prevCart) => {
      const updatedCart = prevCart.filter(item => item.id !== id);
      saveCartData(updatedCart); // 업데이트된 카트를 저장
      return updatedCart;
    });
  };

  // 테이블 번호 업데이트
  const updateTableNumber = (number) => {
    setTableNumber(number);
    saveTableNumber(number); // 업데이트된 테이블 번호를 저장
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeItem,
        tableNumber,
        setTableNumber: updateTableNumber, // 테이블 번호 업데이트 함수 제공
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
