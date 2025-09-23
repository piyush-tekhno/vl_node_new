import { Stack } from "expo-router";
import { useTheme } from "../../../constants/theme";

export default function ComplaintsLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="Complaints"
        options={{
          headerShown: false,
           presentation : "card",
          animation : "slide_from_right",
        }}
      />

      <Stack.Screen
        name="ResolveComplaints"
        options={{
          title: "Resolve Complaints",
          headerShown: true,
           presentation : "card",
          animation : "slide_from_right",
        }}
      />
    </Stack>
  );
}
