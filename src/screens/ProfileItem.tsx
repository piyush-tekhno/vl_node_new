// screens/ProfileItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../constants/theme';

interface ProfileItemProps {
  icon: string;
  title: string;
  value: string;
  onPress: () => void;
  isLast?: boolean;
}

const ProfileItem: React.FC<ProfileItemProps> = ({ icon, title, value, onPress, isLast }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.profileItem, isLast && styles.lastItem, { borderBottomColor: colors.border }]} 
      onPress={onPress}
    >
      <View style={styles.itemLeft}>
        <Ionicons name={icon as any} size={22} color={colors.primary} />
        <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>{title}</Text>
      </View>
      <View style={styles.itemRight}>
        <Text style={[styles.itemValue, { color: colors.textSecondary }]}>{value}</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
    marginLeft: 15,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemValue: {
    fontSize: 14,
    marginRight: 10,
  },
});

export default ProfileItem;