import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../pages/SignInScreen';
import SignUpScreen from '../pages/SignUpScreen';

const Stack = createStackNavigator();

export default function AuthStack(){
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name="SignIn" component={SignInScreen}/>
      <Stack.Screen name="SignUp" component={SignUpScreen}/>
    </Stack.Navigator>
  );
}