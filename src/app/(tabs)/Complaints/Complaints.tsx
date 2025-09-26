import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useTheme } from "../../../constants/theme";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllComplaints } from "@/src/api/complaints/getAllComplaints";
import { deleteComplaint } from "@/src/api/complaints/deleteComplaints";
import { resolveComplaint } from "@/src/api/complaints/postResolvePending";
import { updateComplaint } from "@/src/api/complaints/updateComplaint";
import { useAuth } from "@/src/context/AuthContext";
import Colors from "@/src/constants/Colors";

export default function Complaints() {
  const { colors } = useTheme();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"pending" | "resolved">("pending");
  const { token } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Edit modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    complainer_name: "",
    complainer_mobile: "",
    complainer_city: "",
    complaint_reason: "",
  });

  // Fetch complaints based on status
  const {
    data: complaints = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["getComplaints", filterStatus],
    queryFn: () => getAllComplaints(token, filterStatus),
    enabled: !!token,
  });

  // Delete complaint mutation
  const deleteMutation = useMutation({
    mutationFn: (complaintId: number) => deleteComplaint(token, complaintId),
    onSuccess: (data, complaintId) => {
      queryClient.invalidateQueries({ queryKey: ["getComplaints"] });
      Alert.alert("Success", `Complaint #${complaintId} deleted successfully`);
    },
    onError: (error: any) => {
      Alert.alert("Error", "Failed to delete complaint. Please try again.");
      console.error("Delete error:", error);
    },
  });

  // Resolve complaint mutation
  const resolveMutation = useMutation({
    mutationFn: (complaintId: number) => resolveComplaint(token, complaintId),
    onSuccess: (data, complaintId) => {
      queryClient.invalidateQueries({ queryKey: ["getComplaints"] });
      Alert.alert(
        "Success", 
        `Complaint #${complaintId} marked as resolved successfully!\n\nWhatsApp notification has been sent to the complainer.`
      );
    },
    onError: (error: any) => {
      Alert.alert("Error", "Failed to mark complaint as resolved. Please try again.");
      console.error("Resolve error:", error);
    },
  });

  // Update complaint mutation
// Update your mutation to handle errors better
const updateMutation = useMutation({
  mutationFn: ({ complaintId, formData }: { complaintId: number; formData: any }) =>
    updateComplaint(token, complaintId, formData),
  onSuccess: (data, variables) => {
    queryClient.invalidateQueries({ queryKey: ["getComplaints"] });
    setEditModalVisible(false);
    Alert.alert("Success", `Complaint #${variables.complaintId} updated successfully`);
  },
  onError: (error: any) => {
    console.error('Full update error:', error);
    Alert.alert(
      "Update Error", 
      error.message || "Failed to update complaint. Please try again."
    );
  },
});

  // Handle delete confirmation
  const handleDelete = (complaintId: number, complainerName: string) => {
    Alert.alert(
      "Delete Complaint",
      `Are you sure you want to delete complaint from ${complainerName}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteMutation.mutate(complaintId) },
      ]
    );
  };

  // Handle resolve confirmation
  const handleResolve = (complaintId: number, complainerName: string) => {
    Alert.alert(
      "Mark as Resolved",
      `Are you sure you want to mark complaint from ${complainerName} as resolved?\n\nThis will send a WhatsApp notification to the complainer.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Mark Resolved", style: "default", onPress: () => resolveMutation.mutate(complaintId) },
      ]
    );
  };

  // Handle edit button click
  const handleEdit = (complaint: any) => {
    setEditingComplaint(complaint);
    setEditForm({
      complainer_name: complaint.complainer_name,
      complainer_mobile: complaint.complainer_mobile,
      complainer_city: complaint.complainer_city,
      complaint_reason: complaint.complaint_reason,
    });
    setEditModalVisible(true);
  };

  // Handle update submission
  const handleUpdate = () => {
    if (!editingComplaint) return;

    // Basic validation
    if (!editForm.complainer_name.trim() || !editForm.complaint_reason.trim()) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    if (!editForm.complainer_mobile.trim() || editForm.complainer_mobile.length !== 10) {
      Alert.alert("Error", "Please enter a valid 10-digit mobile number.");
      return;
    }

    updateMutation.mutate({
      complaintId: editingComplaint.complaint_id,
      formData: editForm,
    });
  };

  // Close edit modal
  const closeEditModal = () => {
    setEditModalVisible(false);
    setEditingComplaint(null);
    setEditForm({
      complainer_name: "",
      complainer_mobile: "",
      complainer_city: "",
      complaint_reason: "",
    });
  };

  // 🔍 Filter by search
  const filteredComplaints = complaints.filter((complaint: any) => {
    const matchesSearch =
      complaint.complainer_name.toLowerCase().includes(search.toLowerCase()) ||
      complaint.complainer_city.toLowerCase().includes(search.toLowerCase()) ||
      complaint.complainer_mobile.toLowerCase().includes(search.toLowerCase()) ||
      complaint.complaint_reason.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });

  const renderComplaintItem = ({ item }: { item: any }) => (
    <View style={[styles.complaintCard, { backgroundColor: colors.surface }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {item.complainer_name}
        </Text>
        <View style={styles.headerActions}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  item.status === "resolved" ? colors.success : colors.warning,
              },
            ]}
          >
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          
          {/* Action Buttons - Only show for pending complaints */}
          {item.status === "pending" && (
            <View style={styles.actionButtons}>
              {/* Edit Button */}
              <TouchableOpacity
                style={[styles.editButton, { backgroundColor: colors.info }]}
                onPress={() => handleEdit(item)}
                disabled={deleteMutation.isPending || resolveMutation.isPending}
              >
                <Text style={styles.editButtonText}>✏️</Text>
              </TouchableOpacity>
              
              {/* Delete Button */}
              <TouchableOpacity
                style={[styles.deleteButton, { backgroundColor: colors.error }]}
                onPress={() => handleDelete(item.complaint_id, item.complainer_name)}
                disabled={deleteMutation.isPending || resolveMutation.isPending}
              >
                <Text style={styles.deleteButtonText}>
                  {deleteMutation.isPending ? "..." : "🗑️"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Complaint ID */}
      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: colors.primary }]}>📋 ID:</Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>
          #{item.complaint_id}
        </Text>
      </View>

      {/* Complaint Reason */}
      <Text style={[styles.description, { color: colors.textPrimary }]}>
        {item.complaint_reason}
      </Text>

      {/* City */}
      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: colors.primary }]}>📍 City:</Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>
          {item.complainer_city}
        </Text>
      </View>

      {/* Mobile */}
      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: colors.primary }]}>📱 Mobile:</Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>
          {item.complainer_mobile}
        </Text>
      </View>

      {/* Created At */}
      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: colors.primary }]}>📅 Created:</Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>

      {/* Resolved At OR Mark as Resolved Button */}
      {item.status === "resolved" ? (
        <View style={styles.resolvedInfo}>
          <View style={styles.detailRow}>
            <Text style={[styles.label, { color: colors.primary }]}>
              ✅ Resolved At:
            </Text>
            <Text style={[styles.value, { color: colors.textPrimary }]}>
              {item.resolved_at ? new Date(item.resolved_at).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
          {item.resolved_by && (
            <View style={styles.detailRow}>
              <Text style={[styles.label, { color: colors.primary }]}>
                👤 Resolved By:
              </Text>
              <Text style={[styles.value, { color: colors.textPrimary }]}>
                User #{item.resolved_by}
              </Text>
            </View>
          )}
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.resolveButton, 
            { 
              backgroundColor: resolveMutation.isPending ? colors.disabled : colors.success,
              shadowColor: colors.success,
            }
          ]}
          onPress={() => handleResolve(item.complaint_id, item.complainer_name)}
          disabled={resolveMutation.isPending}
        >
          <Text style={styles.resolveButtonText}>
            {resolveMutation.isPending ? "Marking..." : "Mark as Resolved"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: colors.surface,
              color: colors.textPrimary,
              borderColor: colors.primary,
            },
          ]}
          placeholder="Search by name, city, or reason..."
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Status Filter Buttons */}
      <View style={[styles.filterContainer, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterStatus === "pending" && { backgroundColor: colors.primary },
          ]}
          onPress={() => setFilterStatus("pending")}
        >
          <Text style={[
            styles.filterButtonText,
            filterStatus === "pending" && { color: colors.surface },
          ]}>
            Pending
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filterStatus === "resolved" && { backgroundColor: colors.primary },
          ]}
          onPress={() => setFilterStatus("resolved")}
        >
          <Text style={[
            styles.filterButtonText,
            filterStatus === "resolved" && { color: colors.surface },
          ]}>
            Resolved
          </Text>
        </TouchableOpacity>
      </View>

      {/* Results Count */}
      <View style={[styles.resultsContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
          {filteredComplaints.length} {filterStatus} complaint
          {filteredComplaints.length !== 1 ? "s" : ""} found
        </Text>
      </View>

      {/* Complaints List */}
      <FlatList
        data={filteredComplaints}
        keyExtractor={(item) => item.complaint_id.toString()}
        renderItem={renderComplaintItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={refetch}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No {filterStatus} complaints found
            </Text>
          </View>
        }
      />

      {/* Edit Complaint Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              Edit Complaint #{editingComplaint?.complaint_id}
            </Text>
            
            <ScrollView style={styles.modalForm}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
                  Complainer Name *
                </Text>
                <TextInput
                  style={[styles.textInput, { 
                    backgroundColor: colors.background, 
                    color: colors.textPrimary,
                    borderColor: colors.primary 
                  }]}
                  value={editForm.complainer_name}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, complainer_name: text }))}
                  placeholder="Enter complainer name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
                  Mobile Number *
                </Text>
                <TextInput
                  style={[styles.textInput, { 
                    backgroundColor: colors.background, 
                    color: colors.textPrimary,
                    borderColor: colors.primary 
                  }]}
                  value={editForm.complainer_mobile}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, complainer_mobile: text }))}
                  placeholder="Enter 10-digit mobile number"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
                  City
                </Text>
                <TextInput
                  style={[styles.textInput, { 
                    backgroundColor: colors.background, 
                    color: colors.textPrimary,
                    borderColor: colors.primary 
                  }]}
                  value={editForm.complainer_city}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, complainer_city: text }))}
                  placeholder="Enter city"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
                  Complaint Reason *
                </Text>
                <TextInput
                  style={[styles.textArea, { 
                    backgroundColor: colors.background, 
                    color: colors.textPrimary,
                    borderColor: colors.primary 
                  }]}
                  value={editForm.complaint_reason}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, complaint_reason: text }))}
                  placeholder="Enter complaint reason"
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { backgroundColor: colors.error }]}
                onPress={closeEditModal}
                disabled={updateMutation.isPending}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.updateButton, { 
                  backgroundColor: updateMutation.isPending ? colors.disabled : colors.success 
                }]}
                onPress={handleUpdate}
                disabled={updateMutation.isPending}
              >
                <Text style={styles.modalButtonText}>
                  {updateMutation.isPending ? "Updating..." : "Update"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchInput: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  filterButtonActive: {
    borderWidth: 0,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsText: {
    fontSize: 14,
    fontWeight: "400",
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#fff",
  },
  category: {
    fontSize: 12,
    fontWeight: "500",
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    width: 100,
    marginRight: 8,
  },
  value: {
    fontSize: 12,
    flex: 1,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  creatorInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  creatorLabel: {
    fontSize: 11,
    marginRight: 4,
  },
  creatorName: {
    fontSize: 11,
    fontWeight: "500",
  },
  mobile: {
    fontSize: 11,
  },
 

  //mark as resolved styling
   resolveButton: {
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  
  resolveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  // For loading/disabled state
  resolveButtonDisabled: {
    opacity: 0.6,
    shadowOpacity: 0.1,
    elevation: 1,
  },

  emptyState: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },

  //delete
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
   headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  //modal form
   modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxHeight: "80%",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalForm: {
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },

   modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: '#808080',
  },
  updateButton: {
    backgroundColor: '#7bc748ff'
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
   actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
   textInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    textAlignVertical: "top",
  },
  editButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
