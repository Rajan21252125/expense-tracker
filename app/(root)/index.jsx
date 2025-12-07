import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { Link } from 'expo-router'
import { Text, View } from 'react-native'
import { SignOutButton } from '@/components/SignOutButton'
import { useTransactions } from '../../hooks/useTransaction';
import { useEffect } from 'react';

export default function Page() {
  const { user } = useUser();
  const email = user?.emailAddresses[0].emailAddress;
  const { transactions, summary, isLoading, loadData, deleteTransaction } = useTransactions(user?.id);


  useEffect(() => {
    loadData();
  }, [loadData]);

  console.log("Transactions:", transactions);
  console.log("Summary:", summary);

  return (
    <View>
      <SignedIn>
        <Text>Hello {email}</Text>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </View>
  )
}