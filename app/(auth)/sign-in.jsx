import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useState } from 'react';
import { Image } from 'expo-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles as authStyle } from '../../assets/styles/auth.styles';
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext.js";


export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const { theme } = useTheme();
  const styles = authStyle(theme);

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
  setLoading(true);
  if (!isLoaded) return;

  try {
    const signInAttempt = await signIn.create({
      identifier: emailAddress,   // ✅ FIXED
      password,
    });

    if (signInAttempt.status === "needs_second_factor") {
      await signInAttempt.prepareSecondFactor({
        strategy: "email_code",
      });
      router.push({
        pathname: "/(auth)/verify-otp",
        params: {
          emailAddressId: signInAttempt.supportedSecondFactors[0].emailAddressId,
          signInId: signInAttempt.id,
        },
      });
      console.log("MFA required, redirecting to OTP verification");
      return;
    }

    if (signInAttempt.status === "complete") {
      await setActive({ session: signInAttempt.createdSessionId });
      router.replace('/');
      return;
    }

    console.error("Unexpected state:", JSON.stringify(signInAttempt, null, 2));

  } catch (err) {
    console.log("FULL ERROR:", JSON.stringify(err, null, 2));
    console.log(err);

    if (err?.errors?.length > 0) {
      console.log("CLERK ERROR:", err.errors[0].message);
    }

    if (err?.errors?.[0]?.code === 'form_password_incorrect') {
      setError('Password is incorrect. Please try again.');
    } else {
      setError('An unexpected error occurred. Please try again.');
    }
  }

  setLoading(false);
};


  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading...</Text>
      </View>
    )
  }

  return (
    <KeyboardAwareScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }} enableAutomaticScroll={true} enableOnAndroid={true}>
      <View style={ styles.container }>
        <Image source={require('../../assets/images/revenue-i4.png')} style={styles.illustration} />
        <Text style={styles.title}>Welcome Back</Text>
        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={theme.expense} />
            <Text style={styles.errorText}>{"something went wrong"}</Text>
            <TouchableOpacity onPress={() => setError(null)}>
              <Ionicons name="close-circle" size={20} color={theme.expense} />
            </TouchableOpacity>
          </View>
        ) : null
        }
        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          placeholderTextColor="#9A8478"
          onChangeText={(email) => setEmailAddress(email)}
        />
        <View style={{ width: "100%", position: "relative" }}>
          <TextInput
            style={[styles.input, error && styles.errorInput]}
            placeholderTextColor="#9A8478"
            value={password}
            placeholder="Enter password"
            secureTextEntry={!showPassword}
            onChangeText={(password) => setPassword(password)}
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
        <View style={styles.linksContainer}>
          <View />
          <Link href="/forgot-password" style={styles.link}>
            <Text style={styles.linkText}>Forgot Password</Text>
          </Link>
        </View>
        <TouchableOpacity  onPress={onSignInPress} style={styles.button}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Link href="/sign-up" style={styles.link}>
            <Text style={styles.linkText}>Sign up</Text>
          </Link>
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}