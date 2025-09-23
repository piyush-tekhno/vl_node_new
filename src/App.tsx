// App.tsx
import { ThemeProvider } from './constants/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import  ExpoRouter  from 'expo-router'; // ✅ function, not namespace

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ExpoRouter />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
