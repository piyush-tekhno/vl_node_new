import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, Alert} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../../constants/theme";
import ProfileHeader from "../../screens/ProfileHeader";
import ProfileSection from "../../screens/ProfileSection";
import ProfileDetails from "../../screens/ProfileDetails";
import SettingsSection from "../../screens/SettingsSection";
import LogoutButton from "../../screens/LogoutButton";
import EditProfileModal from "../../screens/EditProfileModal";
import { useQuery } from "@tanstack/react-query";
import { getProfileInfo } from "../../api/profileApi";
import { useAuth } from "../../context/AuthContext";

const ProfileScreen = () => {
  const { colors, theme, setTheme } = useTheme();
  const { token, user: authUser, loading: authLoading } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Default user data structure
  const [userData, setUserData] = useState({
    name: "Loading...",
    username: "@user",
    email: "loading...",
    phone: "loading...",
    location: "loading...",
    user_photo: null
  });

  // Debug logs
  useEffect(() => {
    console.log("🔑 Profile Screen - Auth Context Token:", token);
    console.log("👤 Profile Screen - Auth User:", authUser);
    console.log("⏳ Profile Screen - Auth Loading:", authLoading);
  }, [token, authUser, authLoading]);

  // API call - only run if token exists
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["profile", token],
    queryFn: () => {
      if (!token) {
        throw new Error("No authentication token available");
      }
      return getProfileInfo(token);
    },
    enabled: !!token && !authLoading,
    retry: 1,
  });

  // Update user data when API returns data
  useEffect(() => {
    if (data) {
      console.log("📦 API Data Received:", data);
      
      const mappedData = {
        name: data.name || "User",
        username: `@${data.name?.toLowerCase()?.replace(/\s+/g, '')}` || "@user",
        email: data.email || "No email",
        phone: data.mobile_no || "No phone",
        location: data.city || "No location",
        user_photo: data.user_photo || null
      };
      
      setUserData(mappedData);
    }
  }, [data]);

  // Prepare initial data for modal
  const getInitialEditData = () => ({
    name: data?.name || userData.name,
  email: data?.email || userData.email,
  phone: data?.mobile_no || userData.phone,
  location: data?.city || userData.location
  });

  const handleProfileUpdate = async (updatedData: any) => {
    // Update local state with the new data from API response
    const mappedData = {
      name: updatedData.name || userData.name,
      username: `@${updatedData.name?.toLowerCase()?.replace(/\s+/g, '')}` || userData.username,
      email: updatedData.email || userData.email,
      phone: updatedData.mobile_no || userData.phone,
      location: updatedData.city || userData.location,
      user_photo: userData.user_photo // Keep existing photo
    };
    
    setUserData(mappedData);
   await refetch(); // Refetch to get latest data from server
    // Alert.alert("Success", "Profile updated successfully!");
    console.log("here - profile")
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  // Show auth loading state
  if (authLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={theme === "dark" ? "light" : "dark"} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textPrimary }]}>
            Checking authentication...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show no token state (user not logged in)
  if (!token) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={theme === "dark" ? "light" : "dark"} />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.textPrimary }]}>
            Authentication Required
          </Text>
          <Text style={[styles.errorSubtext, { color: colors.textSecondary }]}>
            Please log in to view your profile
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show API loading state
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={theme === "dark" ? "light" : "dark"} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textPrimary }]}>
            Loading profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  
  // Show API error state
  if (isError) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={theme === "dark" ? "light" : "dark"} />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.textPrimary }]}>
            Failed to load profile
          </Text>
          <Text style={[styles.errorSubtext, { color: colors.textSecondary }]}>
            {error?.message || "Please try again later"}
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={() => refetch()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />

      <ProfileHeader onEditPress={() => setModalVisible(true)} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ProfileSection userData={userData} />
        <ProfileDetails userData={userData} onEditPress={() => setModalVisible(true)} />
        
        <SettingsSection
          notificationsEnabled={notificationsEnabled}
          themeMode={theme}
          setNotificationsEnabled={setNotificationsEnabled}
          setThemeMode={setTheme}
        />

        <LogoutButton />
      </ScrollView>

      <EditProfileModal
        visible={modalVisible}
        onClose={handleCancel}
        initialData={getInitialEditData()}
        onProfileUpdate={handleProfileUpdate}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  scrollView: { 
    flex: 1 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ProfileScreen;