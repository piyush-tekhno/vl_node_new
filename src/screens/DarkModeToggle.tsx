import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { useTheme } from '../constants/theme';

interface DarkModeToggleProps {
  mode: 'light' | 'dark';
  onChangeMode: (mode: 'light' | 'dark') => void;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ mode, onChangeMode }) => {
  const { colors } = useTheme();
  const slideAnim = useRef(new Animated.Value(mode === 'dark' ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: mode === 'dark' ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [mode]);

  const toggleMode = () => {
    onChangeMode(mode === 'dark' ? 'light' : 'dark');
  };

  const interpolatePosition = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22], // adjust circle movement
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={toggleMode}
      style={[styles.toggleContainer, { backgroundColor: mode === 'dark' ? colors.primary : '#ccc' }]}
    >
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ translateX: interpolatePosition }],
            backgroundColor: colors.background,
          },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    width: 40,
    height: 22,
    borderRadius: 12,
    justifyContent: 'center',
    padding: 2,
  },
  circle: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
});

export default DarkModeToggle;
