import { View, Text } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';

const SafeScreen = ({children}) => {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
  return (
    <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom, flex: 1, backgroundColor: theme.background }}>
      {children}
    </View>
  )
}

export default SafeScreen