import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, RefreshControl, TextInput } from 'react-native';
import React, { useState } from 'react';
import { useTheme } from '@/src/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResolvedComplaints() {
  const { colors } = useTheme();
  const [complaints, setComplaints] = useState([
    {
      id: "1",
      title: "Air Conditioning Not Working",
      description: "AC unit in main office is blowing warm air",
      category: "Facilities",
      priority: "High",
      assignedTo: "Maintenance Team",
      status: "pending",
      dateCreated: "2025-09-22",
      dateResolved: null,
      createdBy: "Emily Chen",
      mobile: "+1 (555) 876-5432",
    },
    {
      id: "2",
      title: "Printer Paper Jam",
      description: "Printer on 3rd floor constantly jamming with A4 paper",
      category: "Office Equipment",
      priority: "Medium",
      assignedTo: "IT Support Team",
      status: "pending",
      dateCreated: "2025-09-21",
      dateResolved: null,
      createdBy: "Robert Johnson",
      mobile: "+1 (555) 765-4321",
    },
    {
      id: "3",
      title: "Software License Renewal",
      description: "Adobe Creative Cloud licenses expiring next week",
      category: "Software",
      priority: "High",
      assignedTo: "IT Admin",
      status: "pending",
      dateCreated: "2025-09-20",
      dateResolved: null,
      createdBy: "David Wilson",
      mobile: "+1 (555) 543-2109",
    },
  ]);
  
  //for refresh controler
  const [refreshing, setRefreshing] = useState(false);

  //for search bar
  const [searchQuery, setSearchQuery] = useState('');

  // Filter only pending complaints and apply search filter
  const pendingComplaints = complaints.filter(complaint => 
    complaint.status === 'pending' &&
    (
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.createdBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.priority.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.textSecondary;
    }
  };

  // Simulate API refresh function
  const onRefresh = async () => {
    setRefreshing(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // In real app, you would fetch fresh data from API here
      // For demo, we'll just reset to original data
      setComplaints([
        {
          id: "1",
          title: "Air Conditioning Not Working",
          description: "AC unit in main office is blowing warm air",
          category: "Facilities",
          priority: "High",
          assignedTo: "Maintenance Team",
          status: "pending",
          dateCreated: "2025-09-22",
          dateResolved: null,
          createdBy: "Emily Chen",
          mobile: "+1 (555) 876-5432",
        },
        {
          id: "2",
          title: "Printer Paper Jam",
          description: "Printer on 3rd floor constantly jamming with A4 paper",
          category: "Office Equipment",
          priority: "Medium",
          assignedTo: "IT Support Team",
          status: "pending",
          dateCreated: "2025-09-21",
          dateResolved: null,
          createdBy: "Robert Johnson",
          mobile: "+1 (555) 765-4321",
        },
        {
          id: "3",
          title: "Software License Renewal",
          description: "Adobe Creative Cloud licenses expiring next week",
          category: "Software",
          priority: "High",
          assignedTo: "IT Admin",
          status: "pending",
          dateCreated: "2025-09-20",
          dateResolved: null,
          createdBy: "David Wilson",
          mobile: "+1 (555) 543-2109",
        },
      ]);
      setRefreshing(false);
    }, 1500);
  };

  // Real API integration example
  const fetchComplaintsFromAPI = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('https://your-api.com/api/complaints');
      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      Alert.alert('Error', 'Failed to fetch complaints');
    } finally {
      setRefreshing(false);
    }
  };

  const markAsResolved = (complaintId: string) => {
    Alert.alert(
      "Mark as Resolved",
      "Are you sure you want to mark this complaint as resolved?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Mark Resolved",
          onPress: () => {
            // For API integration, you would call your API here
            markAsResolvedAPI(complaintId);
          }
        }
      ]
    );
  };

  // API integration for marking as resolved
  const markAsResolvedAPI = async (complaintId: string) => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`https://your-api.com/api/complaints/${complaintId}/resolve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'resolved',
          dateResolved: new Date().toISOString()
        })
      });

      if (response.ok) {
        // Update local state
        setComplaints(prevComplaints => 
          prevComplaints.map(complaint => 
            complaint.id === complaintId 
              ? { 
                  ...complaint, 
                  status: 'resolved', 
                  dateResolved: new Date().toISOString().split('T')[0] 
                } 
              : complaint
          )
        );
        
        Alert.alert('Success', 'Complaint marked as resolved successfully!');
      } else {
        throw new Error('Failed to update complaint');
      }
    } catch (error) {
      console.error('Error resolving complaint:', error);
      Alert.alert('Error', 'Failed to mark complaint as resolved');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const renderComplaintItem = ({ item }: { item: any }) => (
    <View style={[styles.complaintCard, { backgroundColor: colors.surface }]}>
      {/* Header with Title and Priority */}
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>{item.title}</Text>
        <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
          <Text style={styles.priorityText}>{item.priority}</Text>
        </View>
      </View>
      
      {/* Category and Date */}
      <View style={styles.metaRow}>
        <Text style={[styles.category, { color: colors.textSecondary }]}>{item.category}</Text>
        <Text style={[styles.date, { color: colors.textTertiary }]}>{item.dateCreated}</Text>
      </View>

      {/* Description */}
      <Text style={[styles.description, { color: colors.textPrimary }]}>{item.description}</Text>

      {/* Assignment Info */}
      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: colors.primary }]}>Assigned To:</Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>{item.assignedTo}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: colors.primary }]}>Created By:</Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>{item.createdBy}</Text>
      </View>

      {/* Resolve Button */}
      <TouchableOpacity 
        style={[styles.resolveButton, { backgroundColor: colors.success }]}
        onPress={() => markAsResolved(item.id)}
      >
        <Text style={styles.resolveButtonText}>Mark as Resolved</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
        <TextInput
          style={[
            styles.searchInput,
            { 
              backgroundColor: colors.surface,
              color: colors.textPrimary,
              borderColor: colors.primary
            }
          ]}
          placeholder="Search complaints..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Text style={[styles.clearButtonText, { color: colors.textSecondary }]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Results Count */}
      <View style={[styles.resultsContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
          {pendingComplaints.length} pending complaint{pendingComplaints.length !== 1 ? 's' : ''} found
          {searchQuery ? ` for "${searchQuery}"` : ''}
        </Text>
      </View>

      {/* Complaints List */}
      <FlatList
        data={pendingComplaints}
        keyExtractor={(item) => item.id}
        renderItem={renderComplaintItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {searchQuery ? 'No complaints found' : 'No pending complaints'}
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
              {searchQuery ? 'Try adjusting your search terms' : 'All complaints have been resolved!'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',  
      // width : '80%',
  },
  searchInput: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 16,
    paddingRight: 40, // Space for clear button
  },
  clearButton: {
    position: 'absolute',
    right: 28,
    padding: 8,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 20,
  },
  complaintCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    width: 90,
    marginRight: 8,
  },
  value: {
    fontSize: 12,
    flex: 1,
  },
  resolveButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  resolveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    padding: 40,
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
});