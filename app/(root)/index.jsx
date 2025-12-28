import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { Link, router } from 'expo-router'
import { Alert, FlatList, Image, RefreshControl, Text, Touchable, TouchableOpacity, View } from 'react-native'
import { SignOutButton } from '@/components/SignOutButton'
import { useTransactions } from '../../hooks/useTransaction';
import { useCallback, useEffect, useState } from 'react';
import PageLoader from '../../components/PageLoader';
import { homeStyle } from '../../assets/styles/home.styles';
import { Ionicons } from "@expo/vector-icons";
import { BalanceCard } from '../../components/BalanceCard';
import { TransactionItem } from '../../components/TransactionItem';
import NoTransactionsFound from '../../components/NoTransactionRecord';
import FilterModal from "../../components/FilterModal";
import { useTheme } from "../../context/ThemeContext";



export default function Page() {
  const { user } = useUser();
  const [refreshing, setRefreshing] =  useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const { theme } = useTheme();
  const styles = homeStyle(theme);



  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData().then(() => setRefreshing(false));
  }, []);
  const email = user?.emailAddresses[0].emailAddress;
  const { 
    transactions, summary, isLoading, 
    loadData, deleteTransaction,
    filters, setFilters       // 👈 Make sure these are in the hook return
  } = useTransactions(user?.id);



  useEffect(() => {
    loadData();
  }, [loadData]);

  console.log("Transactions:", transactions);
  console.log("Summary:", summary);

  const handleDelete = (id) => {
    Alert.alert("Delete Transaction", "Are you sure you want to delete this transaction?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteTransaction(id) },
    ]);
  }

  if (isLoading && !refreshing) {
    return <PageLoader />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.usernameText}>
                {user?.emailAddresses[0].emailAddress.split('@')[0]}
              </Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
                <Ionicons name="add" size={24} color="#fff" />
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
              <SignOutButton />
            </View>
          </View>
        </View>

        <BalanceCard summary={summary} />
        <View style={styles.transactionsHeaderContainer}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>

        {/* Filter Button */}
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterVisible(true)}
        >
          <Ionicons name="filter" size={22} color={theme.primary} />
        </TouchableOpacity>
      </View>

      </View>
      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={({ item }) => (
          <TransactionItem item={item} onDelete={handleDelete} />
        )}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ></FlatList>
      <FilterModal 
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        filters={filters}
        setFilters={setFilters}
      />

    </View>
  )
}