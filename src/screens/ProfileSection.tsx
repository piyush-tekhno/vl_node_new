import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../constants/theme';
import * as ImagePicker from 'expo-image-picker';
import { updateProfilePhoto } from '../api/profile/updateProfile';
import { useAuth } from '../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

interface UserData {
  name: string;
  user_photo?: string | null;
}

interface ProfileSectionProps {
  userData: UserData;
  onPhotoUpdate?: (newPhotoUrl: string) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ userData, onPhotoUpdate }) => {
  const { colors } = useTheme();
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  // Import local profile image - adjust the path based on your project structure
  const defaultProfileImage = require('../assets/images/profile.jpg');

  const pickImage = async () => {
    try {
      console.log("🖼️ Starting image picker from gallery...");
      
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Sorry, we need camera roll permissions to upload photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log("📸 Gallery result:", result);

      if (!result.canceled && result.assets && result.assets[0]) {
        console.log("🖼️ Selected image from gallery:", result.assets[0]);
        await uploadImage(result.assets[0]);
      } else {
        console.log("🚫 Gallery selection canceled");
      }
    } catch (error) {
      console.error('❌ Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      console.log("📷 Starting camera...");
      
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Sorry, we need camera permissions to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log("📸 Camera result:", result);

      if (!result.canceled && result.assets && result.assets[0]) {
        console.log("📷 Taken photo:", result.assets[0]);
        await uploadImage(result.assets[0]);
      } else {
        console.log("🚫 Camera canceled");
      }
    } catch (error) {
      console.error('❌ Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const uploadImage = async (imageAsset: any) => {
    if (!token) {
      Alert.alert('Error', 'Authentication required');
      return;
    }

    console.log("🚀 Starting upload with asset:", {
      ...imageAsset,
      uri: imageAsset.uri?.substring(0, 50) + '...'
    });

    setUploading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const response = await updateProfilePhoto(token, imageAsset);
      
      if (response.success) {
        Alert.alert('Success', 'Profile photo updated successfully!');
        
        await queryClient.invalidateQueries({ queryKey: ['profile'] });
        await queryClient.refetchQueries({ queryKey: ['profile'] });
        
      } else {
        throw new Error(response.message || 'Failed to update profile photo');
      }
    } catch (error: any) {
      console.error('❌ Upload error details:', {
        message: error.message,
        response: error.response?.data,
        asset: imageAsset,
        code: error.code
      });
      
      let errorMessage = 'Failed to upload photo. Please try again.';
      
      if (error.message.includes('Network Error') || error.message.includes('Network request failed')) {
        errorMessage = 'Network error. Please check your connection and server URL.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.code === 'ENOENT') {
        errorMessage = 'File not found. Please try taking the photo again.';
      }
      
      Alert.alert('Upload Failed', errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const showPhotoOptions = () => {
    Alert.alert(
      'Update Profile Photo',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: takePhoto,
        },
        {
          text: 'Choose from Gallery',
          onPress: pickImage,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <View style={[styles.profileSection, { backgroundColor: colors.secondary }]}>
      <View style={styles.avatarContainer}>
        <Image
          source={userData.user_photo ? { uri: userData.user_photo } : defaultProfileImage}
          style={styles.avatar}
          onError={(e) => {
            console.log('Error loading profile image, using default');
            // Fallback to default image if there's an error
          }}
        />
        <TouchableOpacity 
          style={[styles.editAvatarButton, { backgroundColor: colors.primary }]}
          onPress={showPhotoOptions}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="camera" size={16} color="#fff" />
          )}
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

function onPhotoUpdate(photoUrl: any) {
  throw new Error('Function not implemented.');
}
