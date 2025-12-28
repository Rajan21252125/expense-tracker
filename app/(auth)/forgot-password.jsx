import { useSignIn } from "@clerk/clerk-expo";
import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Image } from "expo-image";
import { styles as authStyle } from "../../assets/styles/auth.styles";
import { useTheme } from "../../context/ThemeContext";

export default function ForgotPassword() {
  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();
  const { theme } = useTheme();
  const styles = authStyle(theme);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const onSendCode = async () => {
    setStatus("");
    setError("");

    if (!isLoaded) return;

    try {
      const attempt = await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      if (attempt.status === "needs_first_factor") {
        setStatus("OTP sent to your email!");

        router.push({
          pathname: "/(auth)/reset-password",
          params: { email },
        });
      }
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
      setError("Failed to send reset code");
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
    >
      <View style={styles.container}>
        
        <Image
          source={require("../../assets/images/revenue-i4.png")}
          style={styles.illustration}
        />

        <Text style={styles.title}>Forgot Password</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={theme.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close-circle" size={20} color={theme.expense} />
            </TouchableOpacity>
          </View>
        ) : null}

        {status ? (
          <Text style={[styles.successText, { marginBottom: 12 }]}>
            {status}
          </Text>
        ) : null}

        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#9A8478"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity style={styles.button} onPress={onSendCode}>
          <Text style={styles.buttonText}>Send Reset OTP</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Remember your password?</Text>

          <TouchableOpacity onPress={() => router.replace("/(auth)/sign-in")}>
            <Text style={styles.linkText}> Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
