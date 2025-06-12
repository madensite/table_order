// App.js
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CartProvider } from './CartContext'; // CartProvider import
import { MenuProvider } from './MenuContext';
import InitialScreen from './screens/InitialScreen';
import MainScreen from './screens/MainScreen';
import QuantitySelectorScreen from './screens/QuantitySelectorScreen';
import OrderReviewScreen from './screens/OrderReviewScreen';
import OrderCompleteScreen from './screens/OrderCompleteScreen';
import AdminScreen from './screens/AdminScreen'; // AdminScreen import

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MenuProvider>
        <CartProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="InitialScreen">
              <Stack.Screen name="InitialScreen" component={InitialScreen} options={{ headerShown: false }} />
              <Stack.Screen name="MainScreen" component={MainScreen} options={{ headerShown: false }} />
              <Stack.Screen name="QuantitySelectorScreen" component={QuantitySelectorScreen} options={{ title: '수량 선택' }} />
              <Stack.Screen name="OrderReviewScreen" component={OrderReviewScreen} options={{ title: '주문 확인' }} />
              <Stack.Screen name="OrderCompleteScreen" component={OrderCompleteScreen} options={{ headerShown: false }} />
              <Stack.Screen name="AdminScreen" component={AdminScreen} options={{ title: '관리자 설정' }} />
            </Stack.Navigator>
          </NavigationContainer>
        </CartProvider>
      </MenuProvider> 
    </GestureHandlerRootView>
  );
}

