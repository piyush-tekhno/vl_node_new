import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
// import RegisterScreen from '../screens/RegisterScreen';
// import HomeScreen from '../screens/HomeScreen';
// import VisitorForm from '../screens/VisitorForm';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const isLoggedIn = false; // replace with auth state

  return (
    <Stack.Navigator>
      {!isLoggedIn ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          {/* <Stack.Screen name="Register" component={RegisterScreen} /> */}
        </>
      ) : (
        <>
          {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
          {/* <Stack.Screen name="VisitorForm" component={VisitorForm} /> */}
        </>
      )}
    </Stack.Navigator>
  );
}
