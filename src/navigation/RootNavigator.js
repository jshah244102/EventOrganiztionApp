import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import AuthStack from './AuthStack';
import AppTabs from './AppTabs';
import { ActivityIndicator, View, Text } from 'react-native';

function HomeScreen() {
  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

export default function RootNavigator() {
  const { user, initializing } = useContext(AuthContext);

  if (initializing) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return user ? <AppTabs /> : <AuthStack />;
}
