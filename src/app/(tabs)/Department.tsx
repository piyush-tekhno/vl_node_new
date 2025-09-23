import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { useTheme } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Department() {
  const { colors } = useTheme();
  const [deptName, setDeptName] = useState('');
  const [deptHead, setDeptHead] = useState('');
  const [departments, setDepartments] = useState<Array<{dept_name: string, dept_head: string}>>([]);

  const handleCreateDepartment = () => {
    if (!deptName.trim() || !deptHead.trim()) {
      Alert.alert('Error', 'Please fill in both department name and department head');
      return;
    }

    const newDepartment = {
      dept_name: deptName.trim(),
      dept_head: deptHead.trim()
    };

    setDepartments(prev => [newDepartment, ...prev]);
    setDeptName('');
    setDeptHead('');
    
    Alert.alert('Success', 'Department created successfully!');
  };

  const handleDeleteDepartment = (index: number) => {
    Alert.alert(
      'Delete Department',
      'Are you sure you want to delete this department?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setDepartments(prev => prev.filter((_, i) => i !== index));
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>


      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Create Department Form */}
        <View style={[styles.formContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.formTitle, { color: colors.textPrimary }]}>Create New Department</Text>
          
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

          {/* Create Button */}
          <TouchableOpacity 
            style={[styles.createButton, { backgroundColor: colors.primary }]}
            onPress={handleCreateDepartment}
          >
            <Text style={[styles.createButtonText, { color: colors.surface }]}>
              Create Department
            </Text>
          </TouchableOpacity>
        </View>

        {/* Departments List */}
        <View style={styles.listContainer}>
          <Text style={[styles.listTitle, { color: colors.textPrimary }]}>
            Departments ({departments.length})
          </Text>
          
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
            departments.map((dept, index) => (
              <View key={index} style={[styles.deptCard, { backgroundColor: colors.surface }]}>
                <View style={styles.deptInfo}>
                  <View style={styles.deptHeader}>
                    <Text style={[styles.deptName, { color: colors.textPrimary }]}>
                      {dept.dept_name}
                    </Text>
                    <TouchableOpacity 
                      style={[styles.deleteButton, { backgroundColor: colors.errorLight }]}
                      onPress={() => handleDeleteDepartment(index)}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.deptDetail}>
                    <Text style={[styles.deptLabel, { color: colors.textSecondary }]}>
                      Department Head:
                    </Text>
                    <Text style={[styles.deptValue, { color: colors.textPrimary }]}>
                      {dept.dept_head}
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
  deptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deptName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
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
});