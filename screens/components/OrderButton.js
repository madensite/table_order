// components/OrderButton.js
import React from 'react';
import { Button, StyleSheet, View } from 'react-native';

export default function OrderButton({ orderData }) {
  const submitOrder = () => {
    // 서버로 전송 코드
    console.log('Order submitted:', orderData);
    alert('Order completed!');
  };

  return (
    <View style={styles.container}>
      <Button title="Place Order" color="#D4A373" onPress={submitOrder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#FCFBF5', alignItems: 'center' },
});
