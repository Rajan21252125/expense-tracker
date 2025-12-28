// react custom hook file

import { useEffect } from "react";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
// import { API_URL } from "../constants/api";

const API_URL = "https://expense-tracker-backend-7p5m.onrender.com/api";
// const API_URL = "https://lauditorily-entozoic-octavio.ngrok-free.dev/api";

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });

  const getCurrentMonthRange = () => {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return {
      from: first.toISOString().split("T")[0],
      to: last.toISOString().split("T")[0]
    };
  };

  const [filters, setFilters] = useState({
    type: "all",
    category: "All",
    month: "current",
    ...getCurrentMonthRange()
  });



  const [isLoading, setIsLoading] = useState(true);

  // Build query string dynamically
  const buildQueryString = () => {
    const params = new URLSearchParams();

    if (filters.type !== "all") params.append("type", filters.type);
    if (filters.category !== "All") params.append("category", filters.category);

    if (filters.from) params.append("from", filters.from);
    if (filters.to) params.append("to", filters.to);

    return params.toString();
  };



  const fetchTransactions = useCallback(async () => {
    try {
      const query = buildQueryString();
      const response = await fetch(
        `${API_URL}/transactions/${userId}?${query}`
      );
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [userId, filters]);

  const fetchSummary = useCallback(async () => {
    try {
      const query = buildQueryString();
      const response = await fetch(`${API_URL}/transactions/summary/${userId}?${query}`);
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  }, [userId, filters]);

  const loadData = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);

    try {
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  // Auto reload when filters change
  useEffect(() => {
    loadData();
  }, [filters]);

  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`${API_URL}/transactions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete transaction");

      loadData();
      Alert.alert("Success", "Transaction deleted successfully");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      Alert.alert("Error", error.message);
    }
  };

  return {
    transactions,
    summary,
    isLoading,
    filters,
    setFilters,    // 👈 expose filters setter
    loadData,
    deleteTransaction,
  };
};