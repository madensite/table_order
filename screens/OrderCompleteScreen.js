// screens/OrderCompleteScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';


export default function OrderCompleteScreen({ navigation }) {
  const handleComplete = () => {
    navigation.replace('InitialScreen'); // 완료 시 'InitialScreen'으로 이동
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('InitialScreen');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  // 뒤로가기 버튼 두 번 누르면 앱 종료
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', backAction);
      };
    }, [])
  );


  return (
    <View style={styles.container}>
      <Text style={styles.title}>주문이 완료되었습니다.</Text>
      <Button title="초기 화면으로 돌아가기" color="#D4A373" onPress={handleComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FCFBF5' },
  title: { fontSize: 24, fontWeight: 'bold', color: 'black', marginBottom: 20 },
});


