import { StyleSheet, Text, TouchableOpacity, View, Animated, Easing } from "react-native";
import React, { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { useTheme } from "../constants/theme";
import { Ionicons } from "@expo/vector-icons";

export default function SplashScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();

    // Auto navigate to login after 3 seconds
    const timer = setTimeout(() => {
      router.push("/auth/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSkip = () => {
    router.push("/auth/login");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      {/* Animated Logo and Text */}
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim }
            ]
          }
        ]}
      >
        {/* Logo Icon */}
        <View style={[styles.logoContainer, { backgroundColor: colors.background }]}>
          <Ionicons name="log-in-outline" size={60} color={colors.primary} />
        </View>
        
        {/* App Title */}
        <Text style={[styles.title, { color: colors.background }]}>
          Visitor Log
        </Text>
        
        {/* App Subtitle */}
        <Text style={[styles.subtitle, { color: colors.background }]}>
          Secure Visitor Management System
        </Text>
      </Animated.View>

      {/* Skip Button */}
      <Animated.View 
        style={[
          styles.skipContainer,
          {
            opacity: fadeAnim,
          }
        ]}
      >
        <TouchableOpacity 
          style={[styles.skipButton, { borderColor: colors.background }]}
          onPress={handleSkip}
        >
          <Text style={[styles.skipText, { color: colors.background }]}>
            Continue
          </Text>
        </TouchableOpacity>
      </Animated.View>

    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    marginBottom: 80,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.9,
    textAlign: "center",
    letterSpacing: 0.5,
    marginTop: 5,
  },
  skipContainer: {
    position: "absolute",
    bottom: 50,
  },
  skipButton: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
  },
  skipText: {
    fontSize: 16,
    fontWeight: "500",
  },
  loadingContainer: {
    position: "absolute",
    bottom: 120,
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});