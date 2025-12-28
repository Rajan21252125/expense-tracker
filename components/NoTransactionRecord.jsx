import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { homeStyle } from "../assets/styles/home.styles";
import { useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext.js";

const NoTransactionsFound = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const styles = homeStyle(theme);

  return (
    <View style={styles.emptyState}>
      <Ionicons
        name="receipt-outline"
        size={60}
        color={theme.textLight}
        style={styles.emptyStateIcon}
      />
      <Text style={styles.emptyStateTitle}>No transactions yet</Text>
      <Text style={styles.emptyStateText}>
        Start tracking your finances by adding your first transaction
      </Text>
      <TouchableOpacity style={styles.emptyStateButton} onPress={() => router.push("/create")}>
        <Ionicons name="add-circle" size={18} color={theme.white} />
        <Text style={styles.emptyStateButtonText}>Add Transaction</Text>
      </TouchableOpacity>
    </View>
  );
};
export default NoTransactionsFound;