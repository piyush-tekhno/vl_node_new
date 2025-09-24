// src/app/(tabs)/home/_layout.tsx
import { Stack } from 'expo-router';
import { useTheme } from '../../../constants/theme';

export default function HomeLayout() {
  const { colors } = useTheme();
  
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="VisitorLogDashboard" 
        options={{ 
          title: 'Dashboard',
           presentation : "card",
          animation : "slide_from_right",
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="DashCount" 
        options={{ 
          title: 'Visitor Details',
          presentation : "card",
          animation : "slide_from_right",
          headerShown: false 
        }} 
      />

      <Stack.Screen
        name="profile"
        options={{
          title : "Profile",
          presentation : "card",
          animation : "slide_from_right",
          headerShown : false
        }}
      />

      <Stack.Screen
        name='Complaints'
        options={{
          title : "Complaints",
          presentation : "card",
          animation : "slide_from_right",
          headerShown : false
        }}
      />
    </Stack>
  );
}