import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, BackHandler, ToastAndroid } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';


export default function InitialScreen({ navigation }) {
  const handlePress = () => {
    navigation.replace('MainScreen'); // 터치 시 'MainScreen'으로 이동, 다른 화면 이름으로 변경 가능
  };
  const [lastBackPressed, setLastBackPressed] = useState(null);

  // 뒤로가기 버튼 두 번 누르면 앱 종료
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        const currentTime = new Date().getTime();
        if (lastBackPressed && currentTime - lastBackPressed < 2000) {
          BackHandler.exitApp(); // 앱 종료
          return true;
        }

        // 2초 안에 두 번 누르지 않은 경우 메시지 표시
        setLastBackPressed(currentTime);
        ToastAndroid.show('뒤로 버튼 한 번 더 누르면 앱을 종료합니다.', ToastAndroid.SHORT);
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', backAction);
      };
    }, [lastBackPressed])
  );


  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={1}>
      <View style={styles.mainTextContainer}>
        <Text style={styles.mainText}>ROOM
          <Text style={styles.highlightText}> KU </Text>STIC
        </Text>
      </View>
      <View style={styles.bottomBanner} />
      <Text style={styles.subText}>Room Acoustic</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FCFBF5',
    paddingHorizontal: 20,
  },
  mainTextContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingLeft: 0,
  },
  mainText: {
    fontSize: 24,
    color: '#333333',
    fontFamily: 'Poppins-Regular',
    lineHeight: 36,
  },
  highlightText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: 'Poppins-Bold',
  },
  bottomBanner: {
    backgroundColor: '#4A90E2',
    width: '100%',
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
    subText: {
    fontSize: 24,
    color: '#333333',
    fontFamily: 'Poppins-Regular',
    lineHeight: 36,
    marginTop: 20,
  },
});