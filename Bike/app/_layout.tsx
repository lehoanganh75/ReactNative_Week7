// app/_layout.tsx

import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} /> 
      <Stack.Screen name="sort" options={{ title: 'Bike Shop' }} />
      <Stack.Screen 
        name="detail/[id]" 
        options={{ title: 'Product Details', presentation: 'modal' }} 
      />
    </Stack>
  );
}