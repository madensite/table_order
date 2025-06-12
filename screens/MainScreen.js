import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, Button, Text, StyleSheet, TextInput, Alert, TouchableWithoutFeedback, BackHandler } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrinkMenu from './components/tab/DrinkMenu';
import MainDishMenu from './components/tab/MainDishMenu';
import SideMenu from './components/tab/SideMenu';
import Modal from 'react-native-modal';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { CartContext } from '../CartContext';
import axios from 'axios';

axios.defaults.timeout = 5000;

const Drawer = createDrawerNavigator();

export default function MainScreen() {
  const navigation = useNavigation();
  const { addToCart } = useContext(CartContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const passwordInputRef = useRef(null);
  const [adminButtonPressCount, setAdminButtonPressCount] = useState(0);
  const [timeoutId, setTimeoutId] = useState(null); // 시간 제한 관리


  const handleItemPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleAddToCart = () => {
    if (selectedItem) {
      addToCart({ ...selectedItem, quantity });
    }
    setQuantity(1);
    setModalVisible(false);
  };

  const handleAdminButtonPress = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setAdminButtonPressCount((prevCount) => {
      const newCount = prevCount + 1;

      if (newCount === 4) {
        setPasswordModalVisible(true);
        setAdminButtonPressCount(0);
        setTimeoutId(null);
        setTimeout(() => {
          passwordInputRef.current?.focus();
        }, 100);
      } else {
        const newTimeoutId = setTimeout(() => {
          setAdminButtonPressCount(0);
        }, 1000);
        setTimeoutId(newTimeoutId);
      }

      return newCount;
    });
  };

  const handleAdminPasswordSubmit = async () => {
    try {
      const response = await axios.post(
        'http://122.34.126.6:3000/password-check',
        { password: adminPassword },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200 && response.data.message === 'Password verified') {
        Alert.alert('성공', '비밀번호가 확인되었습니다.');
        setPasswordModalVisible(false); // 모달 닫기
        setAdminPassword(''); // 비밀번호 입력 필드 초기화
        navigation.navigate('AdminScreen');
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 401) {
          Alert.alert('오류', data.message || '비밀번호가 올바르지 않습니다.');
          setAdminPassword(''); // 비밀번호 입력 필드 초기화
        } else {
          Alert.alert('오류', data.message || '서버에서 문제가 발생했습니다.');
          setAdminPassword(''); // 비밀번호 입력 필드 초기화
        }
      } else {
        Alert.alert('오류', '서버와 통신 중 문제가 발생했습니다.');
        setAdminPassword(''); // 비밀번호 입력 필드 초기화
        console.error('비밀번호 검증 오류:', error);
      }
    }
  };


  // 모달 닫힐 때 비밀번호 초기화
  useEffect(() => {
    if (!isPasswordModalVisible) {
      setAdminPassword('');
    }
  }, [isPasswordModalVisible]);


  useFocusEffect(
  React.useCallback(() => {
    const backAction = () => {
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, [])
  );


  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handleAdminButtonPress}>
        <View style={[styles.adminButton, { opacity: 0 }]}>
          <Text style={styles.adminButtonText}>관리자 설정</Text>
        </View>
      </TouchableWithoutFeedback>

      <Drawer.Navigator
        screenOptions={{
          drawerActiveTintColor: 'black',
          drawerInactiveTintColor: '#D4A373',
          drawerActiveBackgroundColor: '#FCFBF5',
          drawerStyle: { backgroundColor: '#FCFBF5', width: 250 },
        }}
      >
        <Drawer.Screen name="메인 메뉴">
          {() => <MainDishMenu onItemPress={handleItemPress} />}
        </Drawer.Screen>
        <Drawer.Screen name="사이드 메뉴">
          {() => <SideMenu onItemPress={handleItemPress} />}
        </Drawer.Screen>
        <Drawer.Screen name="주류/음료">
          {() => <DrinkMenu onItemPress={handleItemPress} />}
        </Drawer.Screen>
      </Drawer.Navigator>

      <View style={styles.buttonContainer}>
        <Button
          title="전체 주문하기"
          color="#D4A373"
          onPress={() => navigation.navigate('OrderReviewScreen')}
        />
      </View>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          {selectedItem && (
            <>
              <Text style={styles.modalTitle}>{selectedItem.name}</Text>
              <Text style={styles.modalPrice}>
                ₩ {selectedItem.price.toLocaleString()}
              </Text>
              <View style={styles.quantityContainer}>
                <TouchableWithoutFeedback
                  onPress={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                >
                  <Text style={styles.quantityButton}>-</Text>
                </TouchableWithoutFeedback>
                <Text style={styles.quantity}>{quantity}</Text>
                <TouchableWithoutFeedback
                  onPress={() => setQuantity(quantity + 1)}
                >
                  <Text style={styles.quantityButton}>+</Text>
                </TouchableWithoutFeedback>
              </View>
              <Button title="담기" color="#D4A373" onPress={handleAddToCart} />
            </>
          )}
        </View>
      </Modal>

      <Modal
        isVisible={isPasswordModalVisible}
        onBackdropPress={() => setPasswordModalVisible(false)}
        animationIn="slideInUp"
        style={styles.passwordModal}
      >
        <View style={styles.passwordModalContent}>
          <Text style={styles.passwordModalTitle}>관리자 비밀번호 입력</Text>
          <TextInput
            ref={passwordInputRef}
            style={styles.passwordInput}
            secureTextEntry
            value={adminPassword}
            onChangeText={setAdminPassword}
            placeholder="비밀번호 입력"
            keyboardType="numeric"
          />
          <Button
            title="확인"
            color="#D4A373"
            onPress={handleAdminPasswordSubmit}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCFBF5' },
  buttonContainer: {
    padding: 10,
    backgroundColor: '#FCFBF5',
    alignItems: 'center',
  },
  modal: { margin: 0, justifyContent: 'flex-end', alignItems: 'flex-end' },
  modalContent: {
    width: '75%',
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  modalPrice: { fontSize: 20, color: 'black', marginBottom: 20 },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityButton: { fontSize: 24, padding: 10, color: 'black' },
  quantity: { fontSize: 18, color: 'black', marginHorizontal: 10 },
  adminButton: {
    position: 'absolute',
    top: 15,
    right: 12,
    padding: 10,
    width: 200,
    backgroundColor: '#D4A373',
    borderRadius: 5,
    zIndex: 10,
  },
  adminButtonText: { color: 'white', fontWeight: 'bold' },
  passwordModal: { justifyContent: 'flex-end', margin: 0 },
  passwordModalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  passwordModalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  passwordInput: {
    borderBottomWidth: 1,
    width: '80%',
    marginBottom: 20,
    textAlign: 'center',
  },
});
