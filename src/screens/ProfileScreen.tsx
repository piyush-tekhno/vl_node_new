// import React, { useState } from "react";
// import { ScrollView, StyleSheet, View, Text, ActivityIndicator } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { StatusBar } from "expo-status-bar";
// import { useTheme } from "../constants/theme";
// import ProfileHeader from "./ProfileHeader";
// import ProfileSection from "./ProfileSection";
// import ProfileDetails from "./ProfileDetails";
// import SettingsSection from "./SettingsSection";
// import LogoutButton from "./LogoutButton";
// import EditProfileModal from "./EditProfileModal";
// import { useQuery } from "@tanstack/react-query";
// import { getProfileInfo } from "../api/profileApi";

// const ProfileScreen = () => {
//   const { colors, theme, setTheme } = useTheme();
//   const [modalVisible, setModalVisible] = useState(false);
//   const [notificationsEnabled, setNotificationsEnabled] = useState(true);

//   const [userData, setUserData] = useState({
//     name: "Jane Doe",
//     username: "@janedoe",
//     email: "jane.doe@example.com",
//     phone: "+1 (234) 567-8901",
//     location: "San Francisco, CA",
//   });

//   const [editData, setEditData] = useState<any>({});

//   const { data, isLoading, isError, refetch } = useQuery({
//     queryKey: ["profile"],
//     queryFn: getProfileInfo,
//     onSuccess: (data) => {
//       setEditData(data);
//       setUserData(data); // Update user data with API response
//     },
//   });

//   const handleSave = () => {
//     setUserData({ ...editData });
//     setModalVisible(false);
//     refetch();
//   };

//   const handleCancel = () => {
//     setEditData({ ...userData });
//     setModalVisible(false);
//   };

//   // Show loading state
//   if (isLoading) return (
//     <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
//       <StatusBar style={theme === "dark" ? "light" : "dark"} />
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={colors.primary} />
//         <Text style={[styles.loadingText, { color: colors.textPrimary }]}>
//           Loading profile...
//         </Text>
//       </View>
//     </SafeAreaView>
//   );
  
//   // Show error state
//   if (isError) return (
//     <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
//       <StatusBar style={theme === "dark" ? "light" : "dark"} />
//       <View style={styles.errorContainer}>
//         <Text style={[styles.errorText, { color: colors.textPrimary }]}>
//           Failed to load profile
//         </Text>
//         <Text style={[styles.errorSubtext, { color: colors.textSecondary }]}>
//           Please try again later
//         </Text>
//       </View>
//     </SafeAreaView>
//   );

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
//       <StatusBar style={theme === "dark" ? "light" : "dark"} />

//       <ProfileHeader onEditPress={() => setModalVisible(true)} />

//       <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
//         <ProfileSection userData={userData} />
//         <ProfileDetails userData={userData} onEditPress={() => setModalVisible(true)} />
        
//         <SettingsSection
//           notificationsEnabled={notificationsEnabled}
//           themeMode={theme}
//           setNotificationsEnabled={setNotificationsEnabled}
//           setThemeMode={setTheme}
//         />

//         <LogoutButton />
//       </ScrollView>

//       <EditProfileModal
//         visible={modalVisible}
//         onClose={handleCancel}
//         editData={editData}
//         setEditData={setEditData}
//         onSave={handleSave}
//         onCancel={handleCancel}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1 
//   },
//   scrollView: { 
//     flex: 1 
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   errorText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   errorSubtext: {
//     fontSize: 14,
//     textAlign: 'center',
//   },
// });

// export default ProfileScreen;