// constants/Colors.ts
export const LightColors = {
  primary: '#F97316',
  primaryLight: '#FDBA74',
  secondary: '#f7eecbff',
  secondaryDark: '#FDE68A',
  accent: '#14B8A6',
  accentLight: '#2DD4BF',
  warning: '#EAB308',
  error: '#DC2626',
  errorLight: '#EF4444',
  textPrimary: '#1F2937',
  textSecondary: '#4B5563',
  textTertiary: '#6B7280',
  surface: '#FFFFFF',
  success : '#7bc748ff',
  background: '#FEF3C7',
  border: '#E5E7EB',
  info : '#678cd6ff',
  disabled : '#808080',
};

export const DarkColors = {
  primary: '#dfb07eff',
  primaryDark: '#F97316',
  secondary: '#1F2937',
  secondaryLight: '#374151',
  accent: '#2DD4BF',
  accentDark: '#14B8A6',
  warning: '#FBBF24',
  error: '#EF4444',
  errorDark: '#DC2626',
  textPrimary: '#F9FAFB',
  textSecondary: '#E5E7EB',
  textTertiary: '#9CA3AF',
   success : '#7bc748ff',
  surface: '#111827',
  background: '#1F2937',
  border: '#374151',
   info : '#678cd6ff',
    disabled : '#808080',
};

// For backward compatibility
const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const LegacyColors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export default { LightColors, DarkColors, LegacyColors };