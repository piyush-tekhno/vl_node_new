// src/app/(tabs)/home/DashCount.tsx
import { StyleSheet, Text, View, FlatList, TextInput } from 'react-native';
import React, { useState } from 'react';
import { useTheme } from '../../../constants/theme';

// Mock visitor data
const visitorData = [
  {
    id: '1',
    name: 'John Smith',
    address: '123 Main Street, New York, NY 10001',
    reason: 'Business Meeting',
    mobile: '+1 (555) 987-6543',
    date: '2025-09-22',
    purpose: 'Discuss project collaboration'
  },
  {
    id: '2',
    name: 'Emily Chen',
    address: '456 Park Avenue, Boston, MA 02108',
    reason: 'Job Interview',
    mobile: '+1 (555) 876-5432',
    date: '2025-09-22',
    purpose: 'Software Engineer position'
  },
  {
    id: '3',
    name: 'Robert Johnson',
    address: '789 Lake Road, Chicago, IL 60601',
    reason: 'Client Delivery',
    mobile: '+1 (555) 765-4321',
    date: '2025-09-21',
    purpose: 'Document submission'
  },
  {
    id: '4',
    name: 'Maria Garcia',
    address: '321 Elm Street, Miami, FL 33101',
    reason: 'Vendor Meeting',
    mobile: '+1 (555) 654-3210',
    date: '2025-09-21',
    purpose: 'Supply chain discussion'
  },
  {
    id: '5',
    name: 'David Wilson',
    address: '654 Pine Lane, Seattle, WA 98101',
    reason: 'Training Session',
    mobile: '+1 (555) 543-2109',
    date: '2025-09-20',
    purpose: 'Software training for team'
  }
];

export default function DashCount() {
  const { colors } = useTheme();
  const [search, setSearch] = useState('');

  // Filter visitors by search input
  const filteredVisitors = visitorData.filter(visitor =>
    visitor.name.toLowerCase().includes(search.toLowerCase()) ||
    visitor.mobile.includes(search) ||
    visitor.reason.toLowerCase().includes(search.toLowerCase()) ||
    visitor.purpose.toLowerCase().includes(search.toLowerCase())
  );

  const renderVisitorItem = ({ item }: { item: any }) => (
    <View style={[styles.visitorCard, { backgroundColor: colors.surface }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.name, { color: colors.textPrimary }]}>{item.name}</Text>
        <Text style={[styles.date, { color: colors.textSecondary }]}>{item.date}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: colors.primary }]}>📱</Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>{item.mobile}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: colors.primary }]}>📍</Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>{item.address}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: colors.primary }]}>🎯</Text>
        <Text style={[styles.value, { color: colors.textPrimary }]}>{item.reason}</Text>
      </View>
      
      {item.purpose && (
        <View style={styles.detailRow}>
          <Text style={[styles.label, { color: colors.primary }]}>📝</Text>
          <Text style={[styles.value, { color: colors.textPrimary }]}>{item.purpose}</Text>
        </View>
      )}
    </View>
  );

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
          placeholder="Search by name, mobile, or reason..."
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
        keyExtractor={(item) => item.id}
        renderItem={renderVisitorItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No visitors found
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
  },
  searchInput: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    fontSize: 16,
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
  visitorCard: {
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
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  date: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    width: 24,
    marginRight: 8,
  },
  value: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});