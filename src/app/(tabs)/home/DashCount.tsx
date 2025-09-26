// src/app/(tabs)/home/DashCount.tsx
import { StyleSheet, Text, View, FlatList, TextInput, Image, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '../../../constants/theme';
import { visitorService, Visitor } from '../../../api/Home/HomeCount';
import { deleteVisitorService } from '../../../api/Home/deleteVisitorEntry';
import { editVisitorService, UpdateVisitorRequest } from '../../../api/Home/editVisitorLogs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/AuthContext';

export default function DashCount() {
  const { colors } = useTheme();
  const [search, setSearch] = useState('');
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState<Visitor | null>(null);
  const [editForm, setEditForm] = useState<UpdateVisitorRequest>({
    visitor_name: '',
    email: '',
    mobile_no: '',
    city: '',
    reason: ''
  });
  
  const { token } = useAuth();
  
  // Get parameters passed from the previous screen
  const params = useLocalSearchParams();
  const period = params.period as string;
  const count = parseInt(params.count as string) || 0;
  
  // Parse the data passed from the previous screen
  const initialData = params.data ? JSON.parse(params.data as string) : [];

  useEffect(() => {
    loadVisitorData();
  }, [period]);

  const loadVisitorData = async () => {
    try {
      setLoading(true);
      
      if (initialData && initialData.length > 0) {
        setVisitors(initialData);
      } else {
        const visitorData = await visitorService.getVisitorData(
          period as 'today' | 'week' | 'month' | 'year'
        );
        setVisitors(visitorData);
      }
    } catch (error) {
      console.error('Error loading visitor data:', error);
      if (initialData && initialData.length > 0) {
        setVisitors(initialData);
      }
    } finally {
      setLoading(false);
    }
  };

  // Edit Visitor Functions
  const handleEditVisitor = (visitor: Visitor) => {
    setEditingVisitor(visitor);
    setEditForm({
      visitor_name: visitor.visitor_name,
      email: visitor.email || '',
      mobile_no: visitor.mobile_no,
      city: visitor.city,
      reason: visitor.reason
    });
    setEditModalVisible(true);
  };

  const handleUpdateVisitor = async () => {
    if (!editingVisitor || !token) {
      Alert.alert("Error", "Missing required data");
      return;
    }

    try {
      setEditingId(editingVisitor.log_id);
      
      const response = await editVisitorService.updateVisitor(
        editingVisitor.log_id,
        editForm,
        token
      );
      
      if (response.success) {
        // Update the visitor in local state
        setVisitors(prevVisitors => 
          prevVisitors.map(visitor => 
            visitor.log_id === editingVisitor.log_id 
              ? { ...visitor, ...editForm }
              : visitor
          )
        );
        
        Alert.alert("Success", response.message);
        setEditModalVisible(false);
        setEditingVisitor(null);
      }
    } catch (error: any) {
      console.error('Update error:', error);
      Alert.alert("Error", error.message || "Failed to update visitor");
    } finally {
      setEditingId(null);
    }
  };

  const handleDeleteVisitor = (log_id: number, visitor_name: string) => {
    Alert.alert(
      "Delete Visitor",
      `Are you sure you want to delete ${visitor_name}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => confirmDelete(log_id)
        }
      ]
    );
  };

  const confirmDelete = async (log_id: number) => {
    try {
      setDeletingId(log_id);
      
      if (!token) {
        Alert.alert("Error", "Authentication token not available");
        return;
      }
      
      const response = await deleteVisitorService.deleteVisitor(log_id, token);
      
      if (response.success) {
        setVisitors(prevVisitors => prevVisitors.filter(visitor => visitor.log_id !== log_id));
        Alert.alert("Success", response.message);
        
        if (visitors.length === 1) {
          loadVisitorData();
        }
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      Alert.alert("Error", error.message || "Failed to delete visitor");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter visitors by search input
  const filteredVisitors = visitors.filter(visitor =>
    visitor.visitor_name.toLowerCase().includes(search.toLowerCase()) ||
    visitor.mobile_no.includes(search) ||
    visitor.reason.toLowerCase().includes(search.toLowerCase()) ||
    visitor.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleImageError = (error: any) => {
    console.log('Image loading error:', error);
  };

  const renderVisitorItem = ({ item }: { item: Visitor }) => (
    <View style={[styles.visitorCard, { backgroundColor: colors.surface }]}>
      {/* Header with photo and basic info */}
      <View style={styles.headerRow}>
        <View style={styles.photoContainer}>
          {item.photo_url ? (
            <Image 
              source={{ uri: item.photo_url }} 
              style={styles.profilePhoto}
              onError={handleImageError}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.placeholderPhoto, { backgroundColor: colors.primary }]}>
              <Text style={styles.placeholderText}>
                {item.visitor_name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.nameDateContainer}>
          <Text style={[styles.name, { color: colors.textPrimary }]}>{item.visitor_name}</Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {new Date(item.visit_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </Text>
          <Text style={[styles.time, { color: colors.textSecondary }]}>
            {new Date(item.created_at).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}
            {/* {item.created_at} */}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {/* Edit Button */}
          <TouchableOpacity 
            style={[styles.editButton, { backgroundColor: colors.primary }]}
            onPress={() => handleEditVisitor(item)}
            disabled={editingId === item.log_id}
          >
            {editingId === item.log_id ? (
              <Ionicons name="hourglass-outline" size={16} color="white" />
            ) : (
              <Ionicons name="pencil-outline" size={16} color="white" />
            )}
          </TouchableOpacity>

          {/* Delete Button */}
          <TouchableOpacity 
            style={[styles.deleteButton, { backgroundColor: colors.error }]}
            onPress={() => handleDeleteVisitor(item.log_id, item.visitor_name)}
            disabled={deletingId === item.log_id}
          >
            {deletingId === item.log_id ? (
              <Ionicons name="hourglass-outline" size={16} color="white" />
            ) : (
              <Ionicons name="trash-outline" size={16} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Visitor details */}
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={[styles.label, { color: colors.primary }]}>📱</Text>
          <Text style={[styles.value, { color: colors.textPrimary }]}>{item.mobile_no}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={[styles.label, { color: colors.primary }]}>📍</Text>
          <Text style={[styles.value, { color: colors.textPrimary }]}>{item.city}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={[styles.label, { color: colors.primary }]}>🎯</Text>
          <Text style={[styles.value, { color: colors.textPrimary }]}>{item.reason}</Text>
        </View>
        
        {item.email && (
          <View style={styles.detailRow}>
            <Text style={[styles.label, { color: colors.primary }]}>📧</Text>
            <Text style={[styles.value, { color: colors.textPrimary }]}>{item.email}</Text>
          </View>
        )}
      </View>
    </View>
  );

  // Edit Modal
  const renderEditModal = () => (
    <Modal
      visible={editModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setEditModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
          <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
            Edit Visitor
          </Text>
          
          <ScrollView style={styles.modalForm}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Name</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.background, 
                  color: colors.textPrimary,
                  borderColor: colors.primary 
                }]}
                value={editForm.visitor_name}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, visitor_name: text }))}
                placeholder="Visitor name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Email</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.background, 
                  color: colors.textPrimary,
                  borderColor: colors.primary 
                }]}
                value={editForm.email}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, email: text }))}
                placeholder="Email"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Mobile No</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.background, 
                  color: colors.textPrimary,
                  borderColor: colors.primary 
                }]}
                value={editForm.mobile_no}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, mobile_no: text }))}
                placeholder="Mobile number"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>City</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.background, 
                  color: colors.textPrimary,
                  borderColor: colors.primary 
                }]}
                value={editForm.city}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, city: text }))}
                placeholder="City"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>Reason</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.background, 
                  color: colors.textPrimary,
                  borderColor: colors.primary,
                  minHeight: 80,
                  textAlignVertical: 'top'
                }]}
                value={editForm.reason}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, reason: text }))}
                placeholder="Reason for visit"
                placeholderTextColor={colors.textSecondary}
                multiline
              />
            </View>
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.cancelButton, { backgroundColor: colors.error }]}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleUpdateVisitor}
              disabled={editingId !== null}
            >
              <Text style={styles.buttonText}>
                {editingId ? 'Updating...' : 'Update'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (loading && visitors.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.textPrimary }]}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
    
      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
        <TextInput
          style={[styles.searchInput, { 
            backgroundColor: colors.surface, 
            color: colors.textPrimary,
            borderColor: colors.primary 
          }]}
          placeholder="Search by name, mobile, reason, or city..."
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Results Count */}
      <View style={[styles.resultsContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
          {filteredVisitors.length} visitor{filteredVisitors.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* Visitors List */}
      <FlatList
        data={filteredVisitors}
        keyExtractor={(item) => item.log_id.toString()}
        renderItem={renderVisitorItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {visitors.length === 0 ? 'No visitors found for this period' : 'No visitors match your search'}
            </Text>
          </View>
        }
      />

      {/* Edit Modal */}
      {renderEditModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerCount: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  searchContainer: {
    padding: 15,
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  resultsContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  resultsText: {
    fontSize: 14,
  },
  listContent: {
    padding: 15,
  },
  visitorCard: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  photoContainer: {
    marginRight: 12,
  },
  profilePhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  placeholderPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nameDateContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
  },
  time: {
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
  value: {
    fontSize: 14,
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalForm: {
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});