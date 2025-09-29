// import { Stack } from "expo-router";
// import { ThemeProvider } from "../constants/theme";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import React from "react";
// import { AuthProvider, useAuth } from "../context/AuthContext";
// import { View, ActivityIndicator } from "react-native";
// import { useTheme } from "../constants/theme";

// const queryClient = new QueryClient();

// // Loading component
// function LoadingScreen() {
//   const { colors } = useTheme();
  
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
//       <ActivityIndicator size="large" color={colors.primary} />
//     </View>
//   );
// }

// // Component to handle routing based on auth state
// function RootLayoutNav() {
//   const { token, loading } = useAuth();

//   // Show loading screen while checking auth state
//   if (loading) {
//     return <LoadingScreen />;
//   }

//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       {!token ? (
//         <Stack.Screen name="auth" options={{ headerShown: false }} />
//       ) : (
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//       )}
//     </Stack>
//   );
// }

// export default function RootLayout() {
//   return (
//     <AuthProvider>
//       <ThemeProvider>
//         <QueryClientProvider client={queryClient}>
//           <RootLayoutNav />
//         </QueryClientProvider>
//       </ThemeProvider>
//     </AuthProvider>
//   );
// }


import { Stack } from "expo-router";
import { ThemeProvider } from "../constants/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { View, ActivityIndicator } from "react-native";
import { useTheme } from "../constants/theme";

const queryClient = new QueryClient();

function LoadingScreen() {
  const { colors } = useTheme();
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

function RootLayoutNav() {
  const { token, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!token ? (
        <Stack.Screen name="index" />
      ) : (
        <Stack.Screen name="(tabs)" />
      )}
      {/* Add a catch-all route */}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <RootLayoutNav />
        </QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}