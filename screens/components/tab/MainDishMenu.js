import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { MenuContext } from '../../../MenuContext'; // MenuContext를 가져옴

export default function MainDishMenu({ onItemPress }) {
  const { menu } = useContext(MenuContext); // MenuContext에서 데이터를 가져옴

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.item, item.isSoldOut && styles.soldOutItem]} // 품절된 메뉴 스타일 추가
      onPress={() => !item.isSoldOut && onItemPress(item)} // 품절된 경우 클릭 불가
      disabled={item.isSoldOut} // 품절된 경우 버튼 비활성화
    >
      <Image source={item.image} style={[styles.image, item.isSoldOut && styles.soldOutImage]} />
      <View>
        <Text style={[styles.name, item.isSoldOut && styles.soldOutText]}>{item.name}</Text>
        <Text style={[styles.price, item.isSoldOut && styles.soldOutText]}>
          {item.isSoldOut ? '품절' : `₩ ${item.price.toLocaleString()}`}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={menu.mainDishes} // MenuContext에서 가져온 mainDishes 데이터를 사용
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
  },
  soldOutItem: {
    backgroundColor: '#f8d7da', // 품절된 메뉴 배경색
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
    opacity: 1,
  },
  soldOutImage: {
    opacity: 0.5, // 품절된 이미지 반투명 처리
  },
  name: {
    fontSize: 18,
    color: 'black',
  },
  price: {
    fontSize: 16,
    color: 'black',
  },
  soldOutText: {
    color: '#d9534f', // 품절된 텍스트 색상
  },
});
