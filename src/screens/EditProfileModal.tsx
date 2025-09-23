// screens/EditProfileModal.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../constants/theme';

interface EditData {
  name: string;
  email: string;
  phone: string;
  location: string;
}

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  editData: EditData;
  setEditData: (data: EditData) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  editData,
  setEditData,
  onSave,
  onCancel
}) => {
  const { colors } = useTheme();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Edit Profile</Text>
            <TouchableOpacity onPress={onCancel}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScroll}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Full Name</Text>
              <TextInput
                style={[styles.input, { 
                  borderColor: colors.border, 
                  color: colors.textPrimary,
                  backgroundColor: colors.background 
                }]}
                value={editData.name}
                onChangeText={(text) => setEditData({...editData, name: text})}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Email</Text>
              <TextInput
                style={[styles.input, { 
                  borderColor: colors.border, 
                  color: colors.textPrimary,
                  backgroundColor: colors.background 
                }]}
                value={editData.email}
                onChangeText={(text) => setEditData({...editData, email: text})}
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Phone</Text>
              <TextInput
                style={[styles.input, { 
                  borderColor: colors.border, 
                  color: colors.textPrimary,
                  backgroundColor: colors.background 
                }]}
                value={editData.phone}
                onChangeText={(text) => setEditData({...editData, phone: text})}
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Location</Text>
              <TextInput
                style={[styles.input, { 
                  borderColor: colors.border, 
                  color: colors.textPrimary,
                  backgroundColor: colors.background 
                }]}
                value={editData.location}
                onChangeText={(text) => setEditData({...editData, location: text})}
              />
            </View>
          </ScrollView>
          
          <View style={[styles.modalActions, { borderTopColor: colors.border }]}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton, { backgroundColor: colors.background }]} 
              onPress={onCancel}
            >
              <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.saveButton, { backgroundColor: colors.primary }]} 
              onPress={onSave}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
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