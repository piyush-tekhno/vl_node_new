import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SettingItem from './SettingItem';
import DarkModeToggle from './DarkModeToggle';
import { useTheme } from '../constants/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface SettingsSectionProps {
  notificationsEnabled: boolean;
  themeMode: 'light' | 'dark';
  setNotificationsEnabled: (value: boolean) => void;
  setThemeMode: (mode: 'light' | 'dark') => void;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  notificationsEnabled,
  themeMode,
  setNotificationsEnabled,
  setThemeMode,
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.settingsCard,
        { backgroundColor: colors.surface, shadowColor: colors.textPrimary },
      ]}
    >
      <Text
        style={[
          styles.sectionTitle,
          { color: colors.textPrimary, borderBottomColor: colors.border },
        ]}
      >
        Preferences
      </Text>

      <View style={styles.darkModeRow}>
        {/* Dynamic icon color */}
        <FontAwesome
          name={themeMode === 'dark' ? 'moon-o' : 'sun-o'}
          size={22}
          color={themeMode === 'dark' ? '#FDBA74' : '#F97316'}
          style={{ marginRight: 10 }}
        />

        <Text style={[styles.darkModeText, { color: colors.textPrimary }]}>
          Dark Mode
        </Text>

        <DarkModeToggle mode={themeMode} onChangeMode={setThemeMode} />
      </View>

      <SettingItem icon="help-circle-outline" title="Help & Support" />
      
    </View>
  );
};

const styles = StyleSheet.create({
  settingsCard: {
    borderRadius: 12,
    marginHorizontal: 15,
    marginBottom: 15,
    paddingHorizontal: 15,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  darkModeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  darkModeText: {
    fontSize: 16,
    flex: 1,
  },
});

export default SettingsSection;
