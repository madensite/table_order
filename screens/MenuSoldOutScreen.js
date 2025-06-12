import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MenuContext } from '../MenuContext';

const Drawer = createDrawerNavigator();

function MenuCategory({ category, items, toggleSoldOut }) {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>₩ {item.price.toLocaleString()}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.switchButton,
          item.isSoldOut ? styles.soldOut : styles.available,
        ]}
        onPress={() => toggleSoldOut(category, item.id)}
      >
        <Text style={styles.switchText}>{item.isSoldOut ? '품절' : '판매'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
    />
  );
}

export default function MenuSoldOutScreen() {
  const { menu, toggleSoldOut } = useContext(MenuContext);

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: 'black',
        drawerInactiveTintColor: '#D4A373',
        drawerActiveBackgroundColor: '#FCFBF5',
        drawerStyle: { backgroundColor: '#FCFBF5', width: 250 },
        headerStyle: { backgroundColor: '#FCFBF5' },
        headerTitleStyle: { color: 'black' },
      }}
    >
      <Drawer.Screen name="메인 메뉴">
        {() => (
          <MenuCategory
            category="mainDishes"
            items={menu.mainDishes}
            toggleSoldOut={toggleSoldOut}
          />
        )}
      </Drawer.Screen>
      <Drawer.Screen name="사이드 메뉴">
        {() => (
          <MenuCategory
            category="sideDishes"
            items={menu.sideDishes}
            toggleSoldOut={toggleSoldOut}
          />
        )}
      </Drawer.Screen>
      <Drawer.Screen name="주류/음료">
        {() => (
          <MenuCategory
            category="drinks"
            items={menu.drinks}
            toggleSoldOut={toggleSoldOut}
          />
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10, // 내부 패딩 설정
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 8, // 메뉴 항목 둥근 모서리 추가
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8, // 이미지 둥근 모서리 추가
  },
  textContainer: {
    flex: 1, // 남은 공간을 채우도록 설정
    marginLeft: 15, // 이미지와 텍스트 간격
    justifyContent: 'center', // 텍스트를 세로 가운데 정렬
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    color: 'gray',
  },
  switchButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 10, // 버튼과 텍스트 간격 추가
  },
  available: {
    backgroundColor: '#4CAF50', // 판매 중 색상
  },
  soldOut: {
    backgroundColor: '#F44336', // 품절 색상
  },
  switchText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
