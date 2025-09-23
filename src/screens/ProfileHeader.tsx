// screens/ProfileHeader.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../constants/theme";
import { useRouter } from "expo-router";

interface ProfileHeaderProps {
  onEditPress: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onEditPress }) => {
  const { colors } = useTheme();

  //router
  const router = useRouter();

  return (
    <View
      style={[
        styles.header,
        { backgroundColor: colors.secondary, borderBottomColor: colors.border },
      ]}
    >
      <TouchableOpacity onPress={() => router.push("/(tabs)/home")}>
        <Text style = {{color : colors.textPrimary}}>Back</Text>
      </TouchableOpacity>

      <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
        Profile
      </Text>
      <TouchableOpacity onPress={onEditPress}>
        <Ionicons name="create-outline" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default ProfileHeader;
