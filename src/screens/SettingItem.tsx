// screens/SettingItem.tsx
import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../constants/theme';

interface SettingItemProps {
  icon: string;
  title: string;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  isSwitch?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({ 
  icon, 
  title, 
  value, 
  onValueChange, 
  isSwitch = false 
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
      <View style={styles.itemLeft}>
        <Ionicons name={icon as any} size={22} color={colors.primary} />
        <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>{title}</Text>
      </View>
      {isSwitch ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          thumbColor={value ? colors.primary : "#f4f3f4"}
          trackColor={{ false: "#767577", true: colors.primaryLight || "#a29bfe" }}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
    marginLeft: 15,
  },
});

export default SettingItem;