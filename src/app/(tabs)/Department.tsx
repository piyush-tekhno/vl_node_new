import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  RefreshControl,
  ActivityIndicator 
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTheme } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';
import { getDetpList } from '@/src/api/getDepartment';
import { useQuery } from '@tanstack/react-query';
import { addDepartment } from '@/src/api/addDepartment';
import { deleteDeptList } from '@/src/api/deleteDeptList';
import { editDeptList } from '@/src/api/editDeptlist'; // Import the edit function
import { useQueryClient } from '@tanstack/react-query';

interface Department {
  dept_id: number;
  user_id: number;
  dept_name: string;
  dept_head: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export default function Department() {
  const { colors } = useTheme();
  const [deptName, setDeptName] = useState('');
  const [deptHead, setDeptHead] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null); // Track which department is being edited
  const [isEditing, setIsEditing] = useState(false); // Track if we're in edit mode
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['deptList'],
    queryFn: () => getDetpList(token || "")
  });

  useEffect(() => {
    if (data) {
      console.log("Departments from API:", data);
      setDepartments(data);
    }
  }, [data]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh departments');
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const handleCreateOrUpdateDepartment = async () => {
    if (!deptName.trim() || !deptHead.trim()) {
      Alert.alert('Error', 'Please fill in both department name and department head');
      return;
    }

    try {
      if (isEditing && editingId) {
        // Update existing department
        await editDeptList(token || "", editingId, {
          dept_name: deptName.trim(),
          dept_head: deptHead.trim()
        });
        
        Alert.alert('Success', 'Department updated successfully!');
      } else {
        // Create new department
        const newDept = { dept_name: deptName.trim(), dept_head: deptHead.trim() };
        await addDepartment(token || "", newDept);
        Alert.alert('Success', 'Department created successfully!');
      }

      // Clear inputs and reset state
      setDeptName('');
      setDeptHead('');
      setEditingId(null);
      setIsEditing(false);

      // Refetch the department list
      queryClient.invalidateQueries(['deptList']);

    } catch (error) {
      const action = isEditing ? 'update' : 'create';
      Alert.alert('Error', `Failed to ${action} department`);
    }
  };

  const handleEditDepartment = (department: Department) => {
    // Set form fields with department data
    setDeptName(department.dept_name);
    setDeptHead(department.dept_head);
    setEditingId(department.dept_id);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    // Clear form and reset edit mode
    setDeptName('');
    setDeptHead('');
    setEditingId(null);
    setIsEditing(false);
  };

  const handleDeleteDepartment = (department: Department) => {
    Alert.alert(
      'Delete Department',
      `Are you sure you want to delete "${department.dept_name}" department?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteDepartment(department.dept_id)
        }
      ]
    );
  };

  const deleteDepartment = async (dept_id: number) => {
    try {
      setDeletingId(dept_id);
      
      const response = await deleteDeptList(token || "", dept_id);
      console.log("Delete department response:", response);
      
      // Update local state immediately for better UX
      setDepartments(prev => prev.filter(dept => dept.dept_id !== dept_id));
      
      // Also refetch to ensure data consistency
      queryClient.invalidateQueries(['deptList']);
      
      Alert.alert('Success', response.message || 'Department deleted successfully!');
    } catch (error: any) {
      console.error('Delete department error:', error);
      
      let errorMessage = 'Failed to delete department';
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'Delete endpoint not found. Please check the API URL.';
        } else if (error.response.status === 401) {
          errorMessage = 'Unauthorized. Please check your authentication.';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textPrimary }]}>
            Loading departments...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            Error loading departments
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={() => refetch()}
          >
            <Text style={[styles.retryButtonText, { color: colors.surface }]}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Create/Edit Department Form */}
        <View style={[styles.formContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.formTitle, { color: colors.textPrimary }]}>
            {isEditing ? 'Edit Department' : 'Create New Department'}
          </Text>
          
          {/* Department Name Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>Department Name</Text>
            <TextInput
              style={[
                styles.textInput,
                { 
                  backgroundColor: colors.background,
                  color: colors.textPrimary,
                  borderColor: colors.primary
                }
              ]}
              placeholder="Enter department name"
              placeholderTextColor={colors.textSecondary}
              value={deptName}
              onChangeText={setDeptName}
            />
          </View>

          {/* Department Head Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>Department Head</Text>
            <TextInput
              style={[
                styles.textInput,
                { 
                  backgroundColor: colors.background,
                  color: colors.textPrimary,
                  borderColor: colors.primary
                }
              ]}
              placeholder="Enter department head name"
              placeholderTextColor={colors.textSecondary}
              value={deptHead}
              onChangeText={setDeptHead}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.formActions}>
            {isEditing && (
              <TouchableOpacity 
                style={[styles.cancelButton, { backgroundColor: colors.textTertiary }]}
                onPress={handleCancelEdit}
              >
                <Text style={[styles.cancelButtonText, { color: colors.surface }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[
                styles.createButton, 
                { 
                  backgroundColor: isEditing ? colors.warning : colors.primary,
                  flex: isEditing ? 1 : 0
                }
              ]}
              onPress={handleCreateOrUpdateDepartment}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.surface} />
              ) : (
                <Text style={[styles.createButtonText, { color: colors.surface }]}>
                  {isEditing ? 'Update Department' : 'Create Department'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Departments List */}
        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
            <Text style={[styles.listTitle, { color: colors.textPrimary }]}>
              Departments ({departments.length})
            </Text>
            {refreshing && (
              <ActivityIndicator size="small" color={colors.primary} />
            )}
          </View>
          
          {departments.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No departments created yet
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
                Create your first department using the form above
              </Text>
            </View>
          ) : (
            departments.map((dept) => (
              <View key={dept.dept_id} style={[styles.deptCard, { backgroundColor: colors.surface }]}>
                <View style={styles.deptInfo}>
                  <View style={styles.deptHeader}>
                    <Text style={[styles.deptName, { color: colors.textPrimary }]}>
                      {dept.dept_name}
                      {editingId === dept.dept_id && (
                        <Text style={{ color: colors.warning, fontSize: 12 }}> (Editing)</Text>
                      )}
                    </Text>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity 
                        style={[
                          styles.editButton, 
                          { 
                            backgroundColor: editingId === dept.dept_id ? colors.success : colors.warning
                          }
                        ]}
                        onPress={() => handleEditDepartment(dept)}
                        disabled={deletingId === dept.dept_id || editingId === dept.dept_id}
                      >
                        <Text style={styles.editButtonText}>
                          {editingId === dept.dept_id ? 'Editing...' : 'Edit'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[
                          styles.deleteButton, 
                          { 
                            backgroundColor: deletingId === dept.dept_id ? colors.textTertiary : colors.errorLight 
                          }
                        ]}
                        onPress={() => handleDeleteDepartment(dept)}
                        disabled={deletingId === dept.dept_id || editingId === dept.dept_id}
                      >
                        {deletingId === dept.dept_id ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Text style={styles.deleteButtonText}>Delete</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.deptDetail}>
                    <Text style={[styles.deptLabel, { color: colors.textSecondary }]}>
                      Department Head:
                    </Text>
                    <Text style={[styles.deptValue, { color: colors.textPrimary }]}>
                      {dept.dept_head}
                    </Text>
                  </View>
                  <View style={styles.deptDetail}>
                    <Text style={[styles.deptLabel, { color: colors.textSecondary }]}>
                      Department ID:
                    </Text>
                    <Text style={[styles.deptValue, { color: colors.textPrimary }]}>
                      {dept.dept_id}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
   loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  formContainer: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 16,
  },
  createButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    margin: 16,
    marginTop: 0,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  emptyState: {
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  deptCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deptInfo: {
    flex: 1,
  },
  
  
  deptDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deptLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginRight: 8,
  },
  deptValue: {
    fontSize: 12,
    fontWeight: '600',
  },

  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },

  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6, // Slightly more rounded for better appearance
    backgroundColor: '#ffa726', // Fallback color if colors.warningLight is not defined
  },
  
  editButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600', // Consistent with delete button
  },
  
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#ef5350', // Fallback color if colors.errorLight is not defined
  },
  
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  
  deptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Better for multi-line department names
    marginBottom: 12,
  },
  
  deptName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
    flexShrink: 1, // Allows text to wrap properly
  },

   errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});