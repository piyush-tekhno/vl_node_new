import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../constants/theme";
import ProfileHeader from "./ProfileHeader";
import ProfileSection from "./ProfileSection";
import ProfileDetails from "./ProfileDetails";
import SettingsSection from "./SettingsSection";
import LogoutButton from "./LogoutButton";
import EditProfileModal from "./EditProfileModal";
import { useQuery } from "@tanstack/react-query";
import { getProfileInfo } from "../api/profileApi";

const ProfileScreen = () => {
  const { colors, theme, setTheme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [userData, setUserData] = useState({
    name: "Jane Doe",
    username: "@janedoe",
    email: "jane.doe@example.com",
    phone: "+1 (234) 567-8901",
    location: "San Francisco, CA",
  });

  const [editData, setEditData] = useState<any>({});

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfileInfo,

    onSuccess: (data) => {
      setEditData(data);
    },
  });

  const handleSave = () => {
    setUserData({ ...editData });
    setModalVisible(false);
    refetch();
  };

  const handleCancel = () => {
    setEditData({ ...userData });
    setModalVisible(false);
  };

  if (isLoading) return null;
  if (isError) return null;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar style={theme === "dark" ? "light" : "dark"} />

      <ProfileHeader onEditPress={() => setModalVisible(true)} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {userData && (
          <>
            <ProfileSection userData={userData} />
            <ProfileDetails
              userData={userData}
              onEditPress={() => setModalVisible(true)}
            />
          </>
        )}

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
        editData={editData}
        setEditData={setEditData}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
});

export default ProfileScreen;
