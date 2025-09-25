import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  TextInput,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/src/constants/theme";
import { useAuth } from "@/src/context/AuthContext";
import { getAllComplaints } from "@/src/api/complaints/getAllComplaints"; // your axios function

export default function ResolvedComplaints() {
  const { colors } = useTheme();
  const { token } = useAuth(); // make sure useAuth() returns { token }

  const [complaints, setComplaints] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // fetch complaints from API
  const fetchComplaints = useCallback(async () => {
    try {
      setRefreshing(true);
      const data = await getAllComplaints(token, "pending");
      setComplaints(data || []);
    } catch (error) {
      Alert.alert("Error", "Failed to load resolved complaints");
    } finally {
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // search filter
  const filteredComplaints = complaints.filter(
    (c) =>
      c.complainer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.complainer_city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.complainer_mobile?.includes(searchQuery) ||
      c.complaint_reason?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const markAsResolved = (complaintId: string) => {
    Alert.alert(
      "Mark as Resolved",
      "Are you sure you want to mark this complaint as resolved?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Mark Resolved",
          onPress: () => {
            // For API integration, you would call your API here
            // markAsResolvedAPI(complaintId);
          },
        },
      ]
    );
  };

  const clearSearch = () => setSearchQuery("");

  const renderComplaintItem = ({ item }: { item: any }) => (
    <View style={[styles.complaintCard, { backgroundColor: colors.surface }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {item.complaint_reason}
        </Text>
        <View
          style={[styles.priorityBadge, { backgroundColor: colors.success }]}
        >
          <Text style={styles.priorityText}>Resolved</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Text style={[styles.category, { color: colors.textSecondary }]}>
          {item.complainer_city}
        </Text>
        <Text style={[styles.date, { color: colors.textTertiary }]}>
          {item.created_at?.split(" ")[0]}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: colors.primary }]}>
          Complainer:
        </Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>
          {item.complainer_name}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: colors.primary }]}>Mobile:</Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>
          {item.complainer_mobile}
        </Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: colors.primary }]}>
          Resolved At:
        </Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>
          {item.resolved_at}
        </Text>
      </View>
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
          placeholder="Search resolved complaints..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Text
              style={[styles.clearButtonText, { color: colors.textSecondary }]}
            >
              ✕
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Results Count */}
      <View
        style={[
          styles.resultsContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
          {filteredComplaints.length} resolved complaint
          {filteredComplaints.length !== 1 ? "s" : ""} found
          {searchQuery ? ` for "${searchQuery}"` : ""}
        </Text>
      </View>

      {/* Complaints List */}
      <FlatList
        data={filteredComplaints}
        keyExtractor={(item) => item.complaint_id.toString()}
        renderItem={renderComplaintItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchComplaints}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {searchQuery ? "No complaints found" : "No resolved complaints"}
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
              {searchQuery
                ? "Try adjusting your search terms"
                : "No complaints have been resolved yet."}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
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
    position: "absolute",
    right: 28,
    padding: 8,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsText: {
    fontSize: 14,
    fontWeight: "500",
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
    marginRight: 12,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    fontWeight: "500",
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
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
    alignItems: "center",
    marginTop: 8,
  },
  resolveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
  },
});
