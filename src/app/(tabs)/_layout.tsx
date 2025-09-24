// src/app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import React from "react";
import { IconSymbol } from "../../components/ui/icon-symbol";
import { HapticTab } from "../../components/haptic-tab";
import { TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/src/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/src/context/AuthContext";
import { Redirect } from "expo-router";

export default function TabLayout() {
  const router = useRouter();
  const { colors } = useTheme();
  const { token } = useAuth();

  // Redirect to login if not authenticated
  if (!token) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarButton: HapticTab,
        headerShown: true,
        headerTitleAlign: "center",
        headerRight: () => (
          <TouchableOpacity
            style={{ marginRight: 15 }}
            onPress={() => router.push("/(tabs)/profile")} // ← Update this navigation
          >
            <Image
              source={{ uri: "https://i.pravatar.cc/100" }}
              style={{ width: 32, height: 32, borderRadius: 16 }}
            />
          </TouchableOpacity>
        ),
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.textPrimary,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="form"
        options={{
          title: "Forms",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="document-text-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Complaints"
        options={{
          title: "Complaints",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbox-ellipses-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Department"
        options={{
          title: "Department",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="business-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
