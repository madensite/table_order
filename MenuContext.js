import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 메뉴 데이터 초기값
const initialMenu = {
  mainDishes: [
    { id: '1', name: '돼지고기 두루치기', price: 17000, isSoldOut: false, image: require('./menu/item1.jpg') },
    { id: '2', name: '트러플 크림 파스타', price: 18000, isSoldOut: false, image: require('./menu/item2.jpg') },
    { id: '3', name: '전기통닭', price: 20000, isSoldOut: false, image: require('./menu/item3.jpg') },
    { id: '4', name: '흑돼지 삼겹살', price: 22000, isSoldOut: false, image: require('./menu/item4.jpg') },
    { id: '5', name: '장트리오 스테이크', price: 28000, isSoldOut: false, image: require('./menu/item5.jpg') },
    { id: '6', name: '가속기홍면', price: 20000, isSoldOut: false, image: require('./menu/item14.jpg') },    
  ],
  sideDishes: [
    { id: '31', name: '밤 티라미수', price: 15000, isSoldOut: false, image: require('./menu/item6.jpg') },
    { id: '32', name: '아보카도 연어 포케', price: 13000, isSoldOut: false, image: require('./menu/item13.jpg') }, 
    { id: '33', name: '나쵸 치즈 살사 계란말이 ', price: 14000, isSoldOut: false, image: require('./menu/item15.jpg') },     
  ],
  drinks: [
    { id: '51', name: '소주', price: 7000, isSoldOut: false, image: require('./menu/item7.jpg') },
    { id: '52', name: '맥주', price: 8000, isSoldOut: false, image: require('./menu/item8.jpg') },
    { id: '53', name: '얼그레이 하이볼', price: 10000, isSoldOut: false, image: require('./menu/item9.jpg') },
    { id: '54', name: '콜라', price: 3000, isSoldOut: false, image: require('./menu/item10.jpg') },
    { id: '55', name: '사이다', price: 3000, isSoldOut: false, image: require('./menu/item11.jpg') },
    { id: '56', name: '제로콜라', price: 3000, isSoldOut: false, image: require('./menu/item12.jpg') },
  ],
};

export const MenuContext = createContext();

export function MenuProvider({ children }) {
  const [menu, setMenu] = useState(initialMenu);

  // AsyncStorage 키
  const STORAGE_KEY = 'MENU_STATE';

  // AsyncStorage에서 데이터 불러오기
  useEffect(() => {
    const loadMenuState = async () => {
      try {
        const storedMenu = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedMenu) {
          setMenu(JSON.parse(storedMenu));
        }
      } catch (error) {
        console.error('Failed to load menu state:', error);
      }
    };
    loadMenuState();
  }, []);

  // AsyncStorage에 데이터 저장
  const saveMenuState = async (updatedMenu) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMenu));
    } catch (error) {
      console.error('Failed to save menu state:', error);
    }
  };

  const toggleSoldOut = (category, itemId) => {
    const updatedMenu = {
      ...menu,
      [category]: menu[category].map((item) =>
        item.id === itemId ? { ...item, isSoldOut: !item.isSoldOut } : item
      ),
    };
    setMenu(updatedMenu);
    saveMenuState(updatedMenu); // 변경사항 저장
  };

  return (
    <MenuContext.Provider value={{ menu, toggleSoldOut }}>
      {children}
    </MenuContext.Provider>
  );
}