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
import { useQuery } from "@tanstack/react-query";
import { getAllComplaints } from "@/src/api/complaints/getAllComplaints";
import { useAuth } from "@/src/context/AuthContext";
import Colors from "@/src/constants/Colors";
export default function Complaints() {
  const { colors } = useTheme();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"pending" | "resolved">(
    "pending"
  );
  const { token } = useAuth(); // 🔑 get token from context
  const router = useRouter();

  // Fetch complaints based on status
  const {
    data: complaints = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["getComplaints", filterStatus],
    queryFn: () => getAllComplaints(token, filterStatus),
    enabled: !!token, // only run when token is available
  });

  // 🔍 Filter by search
  const filteredComplaints = complaints.filter((complaint: any) => {
    const matchesSearch =
      complaint.complainer_name.toLowerCase().includes(search.toLowerCase()) ||
      complaint.complainer_city.toLowerCase().includes(search.toLowerCase()) ||
      complaint.complainer_mobile
        .toLowerCase()
        .includes(search.toLowerCase()) ||
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

    {/* Resolved At OR Mark as Resolved Button */}
    {item.status === "resolved" ? (
      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: colors.primary }]}>
          ✅ Resolved At:
        </Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>
          {item.resolved_at}
        </Text>
      </View>
    ) : (
      <TouchableOpacity
        style={[
          styles.resolveButton, 
          { 
            backgroundColor: colors.success,
            shadowColor: colors.success,
          }
        ]}
        // onPress={() => markAsResolved(item.complaint_id)}
      >
        <Text style={styles.resolveButtonText}>Mark as Resolved</Text>
      </TouchableOpacity>
    )}
  </View>
);


  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
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
          placeholder="Search by name, city, or reason..."
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
            filterStatus === "pending" && { backgroundColor: colors.primary },
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
            filterStatus === "resolved" && { backgroundColor: colors.primary },
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
          {
            flexDirection: "row",
            justifyContent: "space-between",
            marginRight: 5,
          },
          { backgroundColor: colors.background },
        ]}
      >
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
});
