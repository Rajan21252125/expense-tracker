import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useTheme } from "../../context/ThemeContext";
import { styles as authStyle } from "../../assets/styles/auth.styles";

export default function VerifyOtpPage() {
  const { theme } = useTheme();
  const styles = authStyle(theme);

  const { emailAddressId, signInId } = useLocalSearchParams();
  const router = useRouter();

  const { signIn, setActive, isLoaded } = useSignIn();

  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- Verify OTP code ---
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    setLoading(true);
    setError(null);

    try {
      const result = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/");
        return;
      }

      console.log("Unexpected:", result);
    } catch (err) {
      console.log("OTP ERROR:", JSON.stringify(err, null, 2));

      if (err?.errors?.[0]?.code === "form_code_incorrect") {
        setError("Incorrect code. Try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }

    setLoading(false);
  };

  // --- Resend OTP ---
  const onResendPress = async () => {
    if (!isLoaded) return;

    try {
      await signIn.prepareSecondFactor({
        strategy: "email_code",
        emailAddressId,
      });

      setError("A new code has been sent to your email.");
    } catch (err) {
      console.log("RESEND ERROR:", err);
      setError("Could not resend code. Try again later.");
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableAutomaticScroll
      enableOnAndroid
    >
      <View style={styles.container}>
        <Text style={styles.title}>Verify Your Email</Text>

        {error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={theme.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError(null)}>
              <Ionicons name="close-circle" size={20} color={theme.expense} />
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.subTitle}>
          Enter the 6-digit code sent to your email.
        </Text>

        <TextInput
          style={styles.input}
          value={code}
          placeholder="Enter OTP"
          placeholderTextColor="#9A8478"
          keyboardType="numeric"
          maxLength={6}
          onChangeText={setCode}
        />

        <TouchableOpacity style={styles.button} onPress={onVerifyPress}>
          <Text style={styles.buttonText}>
            {loading ? "Verifying..." : "Verify"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onResendPress}>
          <Text style={[styles.linkText, { marginTop: 20 }]}>
            Resend Code
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}
