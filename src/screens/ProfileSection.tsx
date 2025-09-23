// screens/ProfileSection.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../constants/theme';

interface UserData {
  name: string;
}

interface ProfileSectionProps {
  userData: UserData;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ userData }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.profileSection, { backgroundColor: colors.secondary }]}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80' }}
          style={styles.avatar}
        />
        <TouchableOpacity style={[styles.editAvatarButton, { backgroundColor: colors.primary }]}>
          <Ionicons name="camera" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.name, { color: colors.textPrimary }]}>{userData.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  profileSection: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default ProfileSection;