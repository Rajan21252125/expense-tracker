import { useUser } from '@clerk/clerk-expo';
import { Redirect, Stack } from 'expo-router';

const Layout = () => {
    const { isSignedIn, user } = useUser();

    if (!isSignedIn) { return <Redirect href='/(auth)/sign-in' /> }
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}

export default Layout