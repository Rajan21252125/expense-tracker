import { Stack } from "expo-router";
import SafeScreen from "../components/SafeScreen";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProviderCustom } from "@/context/ThemeContext";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout() {
  if (!publishableKey) {
    console.error("❌ Missing Clerk Publishable Key");
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ThemeProviderCustom>
        <SafeScreen>
          <Slot />
        </SafeScreen>
        <StatusBar style="dark" />
      </ThemeProviderCustom>
    </ClerkProvider>
  );
}
