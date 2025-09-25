
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../constants/theme';
import { editProfile, EditProfileData } from '../api/profile/editProfile';
import { useAuth } from '../context/AuthContext';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  initialData: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  onProfileUpdate: (updatedData: any) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  initialData,
  onProfileUpdate
}) => {
  const { colors } = useTheme();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState({
    name: initialData.name,
    email: initialData.email,
    phone: initialData.phone,
    location: initialData.location
  });

  const handleSave = async () => {
    // Validation
    if (!editData.name.trim() || !editData.email.trim() || !editData.phone.trim() || !editData.location.trim()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (editData.phone.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(editData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // Prepare data for API
      const profileData: EditProfileData = {
        name: editData.name,
        email: editData.email,
        mobile_no: editData.phone,
        city: editData.location
      };

      console.log('Updating profile with data:', profileData);
      
      // Call the API
      const result = await editProfile(profileData, token);
      console.log('Profile updated successfully:', result);

      // Notify parent component about the update
      onProfileUpdate(result.data);
      
      // Close modal
      onClose();
      
      Alert.alert('Success', 'Profile updated successfully!');
      console.log("here - edit profile")
      
    } catch (error: any) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to initial values
    setEditData({
      name: initialData.name,
      email: initialData.email,
      phone: initialData.phone,
      location: initialData.location
    });
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleCancel}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Edit Profile</Text>
            <TouchableOpacity onPress={handleCancel} disabled={loading}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Full Name *</Text>
              <TextInput
                style={[styles.input, { 
                  borderColor: colors.border, 
                  color: colors.textPrimary,
                  backgroundColor: colors.background 
                }]}
                value={editData.name}
                onChangeText={(text) => setEditData({...editData, name: text})}
                placeholder="Enter your full name"
                placeholderTextColor={colors.textSecondary}
                editable={!loading}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Email *</Text>
              <TextInput
                style={[styles.input, { 
                  borderColor: colors.border, 
                  color: colors.textPrimary,
                  backgroundColor: colors.background 
                }]}
                value={editData.email}
                onChangeText={(text) => setEditData({...editData, email: text})}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Enter your email"
                placeholderTextColor={colors.textSecondary}
                editable={!loading}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Phone *</Text>
              <TextInput
                style={[styles.input, { 
                  borderColor: colors.border, 
                  color: colors.textPrimary,
                  backgroundColor: colors.background 
                }]}
                value={editData.phone}
                onChangeText={(text) => setEditData({...editData, phone: text})}
                keyboardType="phone-pad"
                maxLength={10}
                placeholder="Enter your phone number"
                placeholderTextColor={colors.textSecondary}
                editable={!loading}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Location *</Text>
              <TextInput
                style={[styles.input, { 
                  borderColor: colors.border, 
                  color: colors.textPrimary,
                  backgroundColor: colors.background 
                }]}
                value={editData.location}
                onChangeText={(text) => setEditData({...editData, location: text})}
                placeholder="Enter your city"
                placeholderTextColor={colors.textSecondary}
                editable={!loading}
              />
            </View>
          </ScrollView>
          
          <View style={[styles.modalActions, { borderTopColor: colors.border }]}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton, { backgroundColor: colors.background }]} 
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.modalButton, 
                styles.saveButton, 
                { backgroundColor: loading ? colors.textSecondary : colors.primary }
              ]} 
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalScroll: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 15,
    marginTop: 10,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
  },
  modalButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  cancelButton: {},
  saveButton: {},
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default EditProfileModal;