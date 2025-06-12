// screens/QuantitySelectorScreen.js
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';

export default function QuantitySelectorScreen({ route, navigation }) {
  const { item, addToCart } = route.params;
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart({ ...item, quantity });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.price}>₩ {item.price.toLocaleString()}</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>
          <Text style={styles.quantityButton}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{quantity}</Text>
        <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
          <Text style={styles.quantityButton}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="메뉴 담기" color="#D4A373" onPress={handleAddToCart} />
        <Button title="뒤로 가기" color="#D4A373" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FCFBF5', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: 'black', marginBottom: 20 },
  price: { fontSize: 20, color: 'black', marginBottom: 20 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  quantityButton: { fontSize: 24, padding: 10, color: 'black' },
  quantity: { fontSize: 18, color: 'black', marginHorizontal: 10 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20, marginTop: 20 },
});
