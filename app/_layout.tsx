import { Stack } from 'expo-router';
import { AlertProvider } from '@/template';
import { AuthProvider, MockAuthRouter, MockAuthProvider } from '@/template/auth';

export default function RootLayout() {
  return (
    <AlertProvider>
      <MockAuthProvider>
        <MockAuthRouter loginRoute="/login" excludeRoutes={['/login']}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="login" />
          </Stack>
        </MockAuthRouter>
      </MockAuthProvider>
    </AlertProvider>
  );
}
