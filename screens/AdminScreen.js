import React, { useState, useContext } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MenuSoldOutScreen from './MenuSoldOutScreen';
import { CartContext } from '../CartContext';
import axios from 'axios';

axios.defaults.timeout = 5000;

const Tab = createMaterialTopTabNavigator();

function TableNumberSetting({ tableNumber, setTableNumber }) {
  const [localTableNumber, setLocalTableNumber] = useState(tableNumber || ''); // 로컬 상태

  const handleTableNumberChange = (value) => {
    setLocalTableNumber(value); // 로컬 상태에만 변경
  };

  const handleSave = () => {
    setTableNumber(localTableNumber); // 저장 버튼을 눌렀을 때만 전역 상태 업데이트
    Alert.alert('성공', `테이블 번호가 성공적으로 저장되었습니다.\n현재 테이블 번호: ${localTableNumber}`);
  };

  return (
    <View style={styles.tabContainer}>
      <Text style={styles.label}>테이블 번호 설정</Text>
      <TextInput
        style={styles.input}
        value={localTableNumber} // 로컬 상태 사용
        onChangeText={handleTableNumberChange}
        placeholder="테이블 번호 입력"
        keyboardType="numeric"
      />
      <View style={styles.saveButtonContainer}>
        <Button title="저장" onPress={handleSave} color="#D4A373" />
      </View>
    </View>
  );
}


function PasswordReset() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert('오류', '현재 비밀번호와 새 비밀번호를 모두 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      // 현재 비밀번호 검증
      const verifyResponse = await axios.post(
        'http://122.34.126.6:3000/password-check',
        { password: currentPassword },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (verifyResponse.status === 200 && verifyResponse.data.message === 'Password verified') {
        // 새 비밀번호 업데이트 요청
        const updateResponse = await axios.post(
          'http://122.34.126.6:3000/admin-password',
          { new_password: newPassword },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (updateResponse.status === 200 && updateResponse.data.message === 'Password updated successfully') {
          Alert.alert('성공', '비밀번호가 성공적으로 변경되었습니다.');
          setCurrentPassword(''); // 입력 필드 초기화
          setNewPassword('');
        } else {
          Alert.alert('오류', updateResponse.data.message || '비밀번호 변경에 실패했습니다.');
        }
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        // 401 Unauthorized: 현재 비밀번호가 일치하지 않음
        if (status === 401) {
          Alert.alert('오류', data.message || '현재 비밀번호가 올바르지 않습니다.');
          setCurrentPassword(''); // 입력 필드 초기화
          setNewPassword('');
        } else {
          // 다른 서버 오류
          Alert.alert('오류', data.message || '서버에서 오류가 발생했습니다.');
          setCurrentPassword(''); // 입력 필드 초기화
          setNewPassword('');
        }
      } else {
        // 네트워크 오류
        Alert.alert('오류', '서버와 통신 중 문제가 발생했습니다.');
        setCurrentPassword(''); // 입력 필드 초기화
        setNewPassword('');
        console.error('비밀번호 변경 오류:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.tabContainer}>
      <Text style={styles.label}>관리자 비밀번호 재설정</Text>
      <TextInput
        style={styles.input}
        value={currentPassword}
        onChangeText={setCurrentPassword}
        placeholder="현재 비밀번호 입력"
        keyboardType="numeric"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="새 비밀번호 입력"
        keyboardType="numeric"
        secureTextEntry
      />
      <View style={styles.saveButtonContainer}>
        <Button
          title={loading ? '저장 중...' : '비밀번호 저장'}
          onPress={handlePasswordChange}
          color="#D4A373"
          disabled={loading}
        />
      </View>
    </View>
  );
}




export default function AdminScreen() {
  const { tableNumber, setTableNumber, updateMenuState, menuState } = useContext(CartContext);

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: 'black',
          tabBarIndicatorStyle: { backgroundColor: '#D4A373' },
          tabBarStyle: { backgroundColor: '#FCFBF5' },
        }}
      >
        <Tab.Screen name="테이블 번호 설정">
          {() => (
            <TableNumberSetting
              tableNumber={tableNumber}
              setTableNumber={setTableNumber}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="메뉴 품절 처리">
          {() => (
            <MenuSoldOutScreen
              menuState={menuState}
              updateMenuState={updateMenuState}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="비밀번호 재설정" component={PasswordReset} />
      </Tab.Navigator>
    </View>
  );
}


const styles = StyleSheet.create({
  tabContainer: { flexGrow: 1, padding: 20, backgroundColor: '#FCFBF5' },
  label: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#D4A373',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  saveButtonContainer: { marginTop: 20 },
});
