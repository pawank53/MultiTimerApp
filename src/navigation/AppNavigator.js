import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createNativeStackNavigator();
const Tab= createBottomTabNavigator();  

import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';


export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home">
        <Tab.Screen name="Home" component={HomeScreen} 
        options={{
          tabBarIcon: ({ focused,color, size }) => (
            <Icon name="home" size={30} color={focused ? "#007bff" : "#999"} />
          ),
        }}
        />
        <Tab.Screen name="History" component={HistoryScreen} 
        options={{
          tabBarIcon: ({ focused,color, size }) => (
            <Icon name="history" size={30} color={focused ? "#007bff" : "#999"} />
          ),
        }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}