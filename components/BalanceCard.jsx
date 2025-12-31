import { View, Text } from "react-native";
import { homeStyle } from "../assets/styles/home.styles";
import { useTheme } from "../context/ThemeContext.js";
import { formatCurrencyINR } from "../lib/utility.js";

export const BalanceCard = ({ summary }) => {
  const { theme } = useTheme();
  const styles = homeStyle(theme);

  return (
    <View style={styles.balanceCard}>
      <Text style={styles.balanceTitle}>Total Balance</Text>
      <Text style={styles.balanceAmount}>{formatCurrencyINR(parseFloat(summary.balance))}</Text>
      <View style={styles.balanceStats}>
        <View style={styles.balanceStatItem}>
          <Text style={styles.balanceStatLabel}>Income</Text>
          <Text style={[styles.balanceStatAmount, { color: theme.income }]}>
            +{formatCurrencyINR(parseFloat(summary.income))}
          </Text>
        </View>
        <View style={[styles.balanceStatItem, styles.statDivider]} />
        <View style={styles.balanceStatItem}>
          <Text style={styles.balanceStatLabel}>Expenses</Text>
          <Text style={[styles.balanceStatAmount, { color: theme.expense }]}>
            -₹{Math.abs(parseFloat(summary.expenses)).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};