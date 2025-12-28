import { View, ActivityIndicator } from "react-native";
import { homeStyle } from "../assets/styles/home.styles.js";
import { useTheme } from "../context/ThemeContext.js";


const PageLoader = () => {
  const { theme } = useTheme();
  const styles = homeStyle(theme);
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.primary} />
    </View>
  );
};
export default PageLoader;