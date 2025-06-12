import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartContext } from '../CartContext';
import axios from 'axios';

axios.defaults.timeout = 5000;

export default function OrderReviewScreen({ navigation }) {
  const { cart, updateQuantity, removeItem, tableNumber } = useContext(CartContext);
  const [orderCounter, setOrderCounter] = useState(null); // 초기값을 null로 설정하여 초기 로딩 중인지 표시

  // AsyncStorage에서 orderCounter 값을 로드
  useEffect(() => {
    const loadOrderCounter = async () => {
      try {
        const storedCounter = await AsyncStorage.getItem('orderCounter');
        if (storedCounter !== null) {
          setOrderCounter(parseInt(storedCounter, 10));
        } else {
          setOrderCounter(1); // 저장된 값이 없으면 기본값을 1로 설정
        }
      } catch (error) {
        console.error('Failed to load order counter from storage:', error);
        setOrderCounter(1); // 에러 발생 시 기본값 설정
      }
    };
    loadOrderCounter();
  }, []);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString();
  };

  const handleCompleteOrder = async () => {
    if (orderCounter === null) return; // 초기값이 아직 로드되지 않은 경우 처리 중단

    try {
      const sortedCart = [...cart].sort((a, b) => a.id - b.id);
      let currentOrderCounter = orderCounter;

      for (const item of sortedCart) {
        const orderSummary = `${tableNumber}, ${item.name}, ${item.quantity}, ${currentOrderCounter}`;
        
        await axios.post('http://122.34.126.6:3000/orders', { data: orderSummary })
          .then(response => {
            console.log(`Data sent to server for item ${item.name}:`, response.data);
          })
          .catch(error => {
            console.error(`Error sending data for item ${item.name}:`, error);
          });

        console.log(orderSummary); // 축약된 주문 내역 출력
      }
      currentOrderCounter += 1; // 증가

        // 상한 도달 시 초기화
      if (currentOrderCounter > 300) {
        currentOrderCounter = 1; // 다시 1로 초기화
      }

      // AsyncStorage에 업데이트된 orderCounter 저장
      await AsyncStorage.setItem('orderCounter', currentOrderCounter.toString());
      setOrderCounter(currentOrderCounter);

      // 주문 데이터 초기화
      updateQuantity(null, 0); // 모든 아이템 제거
      removeItem(null); // 카트 비우기

      // 주문 완료 후 초기 화면으로 이동
      navigation.replace('OrderCompleteScreen');
    } catch (error) {
      console.error('Error during order completion:', error);
    }
  };


  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>₩ {(item.price * item.quantity).toLocaleString()}</Text>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)} style={styles.controlButton}>
          <Text style={styles.controlText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)} style={styles.controlButton}>
          <Text style={styles.controlText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.deleteButton}>
          <Text style={styles.deleteText}>삭제</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (orderCounter === null) {
    // 초기 로딩 상태
    return (
      <View style={styles.container}>
        <Text style={styles.title}>로딩 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>주문 확인</Text>
      <FlatList
        data={[...cart].sort((a, b) => a.id - b.id)} // id 순으로 정렬된 cart 배열
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
      <Text style={styles.total}>총 금액: ₩ {calculateTotal()}</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="주문 완료"
          color="#D4A373"
          onPress={handleCompleteOrder}
        />
        <Button
          title="뒤로 가기"
          color="#D4A373"
          onPress={() => navigation.goBack()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCFBF5', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: 'black', marginBottom: 20 },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  name: { fontSize: 18, color: 'black' },
  price: { fontSize: 18, color: 'black' },
  controls: { flexDirection: 'row', alignItems: 'center' },
  controlButton: { padding: 5, backgroundColor: '#eee', borderRadius: 5, marginHorizontal: 5 },
  controlText: { fontSize: 18, color: 'black' },
  quantity: { fontSize: 18, color: 'black' },
  deleteButton: { marginLeft: 10, paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#ff4d4d', borderRadius: 5 },
  deleteText: { color: 'white', fontSize: 14 },
  total: { fontSize: 20, fontWeight: 'bold', color: 'black', marginVertical: 20, textAlign: 'center' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 20 },
});
