import { useLocalSearchParams, useRouter } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { styles as authStyle } from "../../assets/styles/auth.styles";
import { useTheme } from "../../context/ThemeContext";

export default function ResetPassword() {
  const params = useLocalSearchParams(); // ✅ correct hook
  const email = params.email;

  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter();
  const { theme } = useTheme();
  const styles = authStyle(theme);

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onResetPassword = async () => {
    if (!isLoaded) return;

    try {
      const attempt = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: otp,
        password,
      });

      if (attempt.status === "complete") {
        await setActive({ session: attempt.createdSessionId });
        router.replace('/');
      } else {
        setError("Invalid OTP or password");
      }
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
      console.log(err);
      setError("Something went wrong");
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

        <Text style={styles.title}>Reset Password</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={theme.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close-circle" size={20} color={theme.expense} />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          placeholder="Enter OTP"
          placeholderTextColor="#9A8478"
          style={styles.input}
          value={otp}
          onChangeText={setOtp}
        />

        <View style={{ width: "100%", position: "relative" }}>
          <TextInput
            placeholder="New Password"
            placeholderTextColor="#9A8478"
            secureTextEntry={!showPassword}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: 15,
              top: "40%",
              transform: [{ translateY: -12 }],
            }}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color={theme.primary}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={onResetPassword}>
          <Text style={styles.buttonText}>Update Password</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Back to</Text>
          <TouchableOpacity onPress={() => router.replace("/(auth)/sign-in")}>
            <Text style={styles.linkText}> Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
