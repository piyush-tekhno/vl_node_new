import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useTheme } from "../../../constants/theme";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Complaints() {
  const { colors } = useTheme();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"pending" | "resolved">(
    "pending"
  ); // Only pending and resolved

    const router = useRouter();
  const complaintData = [
    {
      id: "1",
      title: "Network Connectivity Issue",
      description: "Unable to connect to office WiFi in conference room",
      category: "IT Infrastructure",
      priority: "High",
      assignedTo: "IT Support Team",
      status: "resolved" as const,
      dateCreated: "2025-09-22",
      dateResolved: "2025-09-22",
      createdBy: "John Smith",
      mobile: "+1 (555) 987-6543",
    },
    {
      id: "2",
      title: "Air Conditioning Not Working",
      description: "AC unit in main office is blowing warm air",
      category: "Facilities",
      priority: "High",
      assignedTo: "Maintenance Team",
      status: "pending" as const,
      dateCreated: "2025-09-22",
      dateResolved: null,
      createdBy: "Emily Chen",
      mobile: "+1 (555) 876-5432",
    },
    {
      id: "3",
      title: "Printer Paper Jam",
      description: "Printer on 3rd floor constantly jamming with A4 paper",
      category: "Office Equipment",
      priority: "Medium",
      assignedTo: "IT Support Team",
      status: "pending" as const,
      dateCreated: "2025-09-21",
      dateResolved: null,
      createdBy: "Robert Johnson",
      mobile: "+1 (555) 765-4321",
    },
    {
      id: "4",
      title: "Cleanliness Issue",
      description: "Pantry area requires more frequent cleaning",
      category: "Housekeeping",
      priority: "Medium",
      assignedTo: "Housekeeping Staff",
      status: "resolved" as const,
      dateCreated: "2025-09-21",
      dateResolved: "2025-09-22",
      createdBy: "Maria Garcia",
      mobile: "+1 (555) 654-3210",
    },
    {
      id: "5",
      title: "Software License Renewal",
      description: "Adobe Creative Cloud licenses expiring next week",
      category: "Software",
      priority: "High",
      assignedTo: "IT Admin",
      status: "pending" as const,
      dateCreated: "2025-09-20",
      dateResolved: null,
      createdBy: "David Wilson",
      mobile: "+1 (555) 543-2109",
    },
  ];

  // Filter complaints by search input and status
  const filteredComplaints = complaintData.filter((complaint) => {
    const matchesSearch =
      complaint.title.toLowerCase().includes(search.toLowerCase()) ||
      complaint.description.toLowerCase().includes(search.toLowerCase()) ||
      complaint.createdBy.toLowerCase().includes(search.toLowerCase()) ||
      complaint.assignedTo.toLowerCase().includes(search.toLowerCase()) ||
      complaint.category.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = complaint.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    return status === "resolved" ? colors.success : colors.warning;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return colors.error;
      case "medium":
        return colors.warning;
      case "low":
        return colors.success;
      default:
        return colors.textSecondary;
    }
  };

  const renderComplaintItem = ({ item }: { item: any }) => (
    <View style={[styles.complaintCard, { backgroundColor: colors.surface }]}>
      {/* Header with Title, Status and Date */}
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {item.title}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      {/* Priority and Category */}
      <View style={styles.metaRow}>
        <View
          style={[
            styles.priorityBadge,
            { backgroundColor: getPriorityColor(item.priority) },
          ]}
        >
          <Text style={styles.priorityText}>{item.priority} Priority</Text>
        </View>
        <Text style={[styles.category, { color: colors.textSecondary }]}>
          {item.category}
        </Text>
      </View>

      {/* Description */}
      <Text style={[styles.description, { color: colors.textPrimary }]}>
        {item.description}
      </Text>

      {/* Assignment and Contact Info */}
      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: colors.primary }]}>
          👤 Assigned To:
        </Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>
          {item.assignedTo}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: colors.primary }]}>
          📅 Created:
        </Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>
          {item.dateCreated}
        </Text>
      </View>

      {item.status === "resolved" && (
        <View style={styles.detailRow}>
          <Text style={[styles.label, { color: colors.primary }]}>
            ✅ Resolved:
          </Text>
          <Text style={[styles.value, { color: colors.textPrimary }]}>
            {item.dateResolved}
          </Text>
        </View>
      )}

      {/* Created By */}
      <View style={styles.footerRow}>
        <View style={styles.creatorInfo}>
          <Text style={[styles.creatorLabel, { color: colors.textSecondary }]}>
            Created by:
          </Text>
          <Text style={[styles.creatorName, { color: colors.textPrimary }]}>
            {item.createdBy}
          </Text>
        </View>
        <Text style={[styles.mobile, { color: colors.textSecondary }]}>
          {item.mobile}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Bar */}
      <View
        style={[styles.searchContainer, { backgroundColor: colors.background }]}
      >
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: colors.surface,
              color: colors.textPrimary,
              borderColor: colors.primary,
            },
          ]}
          placeholder="Search complaints by title, description, or assigned to..."
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Status Filter Buttons */}
      <View
        style={[styles.filterContainer, { backgroundColor: colors.background }]}
      >
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterStatus === "pending" && [
              styles.filterButtonActive,
              { backgroundColor: colors.primary },
            ],
          ]}
          onPress={() => setFilterStatus("pending")}
        >
          <Text
            style={[
              styles.filterButtonText,
              filterStatus === "pending" && { color: colors.surface },
            ]}
          >
            Pending
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filterStatus === "resolved" && [
              styles.filterButtonActive,
              { backgroundColor: colors.primary },
            ],
          ]}
          onPress={() => setFilterStatus("resolved")}
        >
          <Text
            style={[
              styles.filterButtonText,
              filterStatus === "resolved" && { color: colors.surface },
            ]}
          >
            Resolved
          </Text>
        </TouchableOpacity>
      </View>

      {/* Results Count */}
      <View
        style={[
          styles.resultsContainer, 
         {flexDirection : 'row', justifyContent : 'space-between', marginHorizontal : 5, }, { backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
          {filteredComplaints.length} {filterStatus} complaint
          {filteredComplaints.length !== 1 ? "s" : ""} found
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/(tabs)/Complaints/ResolveComplaints")}
        >
          <Text  style={[styles.resultsText, {fontWeight : 800}, { color: colors.textSecondary }]}>Resolve Complaints</Text>
        </TouchableOpacity>
      </View>

      {/* Complaints List */}
      <FlatList
        data={filteredComplaints}
        keyExtractor={(item) => item.id}
        renderItem={renderComplaintItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No {filterStatus} complaints found
            </Text>
          </View>
        }
      />
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
  emptyState: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
});
