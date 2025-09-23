import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  Modal,
  View,
  StyleSheet
} from 'react-native';
import { useTheme } from '../constants/theme';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

const LogoutButton = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const { logout } = useAuth();   // ✅ use logout from context

  const handleLogout = async () => {
    try {
      await logout();   // ✅ call context logout (clears user + token + storage)
      console.log('User logged out successfully');
      setModalVisible(false);
      router.replace('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      setModalVisible(false);
    }
  };

  return (
    <>
      {/* Logout Button */}
      <TouchableOpacity 
        style={[styles.logoutButton, { 
          backgroundColor: colors.surface, 
          shadowColor: colors.textPrimary 
        }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.logoutText, { color: colors.error }]}>Log Out</Text>
      </TouchableOpacity>

      {/* Logout Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                Log Out
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Are you sure you want to log out?
              </Text>
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton, { 
                  backgroundColor: colors.background,
                  borderColor: colors.border 
                }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.buttonText, { color: colors.textSecondary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.logoutButton, { backgroundColor: colors.error }]}
                onPress={handleLogout}
              >
                <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
                  Log Out
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    marginHorizontal: 15,
    marginBottom: 30,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LogoutButton;
