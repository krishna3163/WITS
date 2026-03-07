import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export default function WalletDashboardScreen() {
  const { session } = useAuthStore();
  const userId = session?.user?.id;

  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchWalletData();
    }
  }, [userId]);

  const fetchWalletData = async () => {
    try {
      const authHeader = { Authorization: `Bearer ${session?.access_token}` };
      const [walletRes, transRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/wallet/user/${userId}`, { headers: authHeader }),
        axios.get(`${API_BASE_URL}/api/wallet/transactions/${userId}`, { headers: authHeader })
      ]);
      setWallet(walletRes.data);
      setTransactions(transRes.data);
    } catch (error) {
      console.error('Wallet Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTransaction = ({ item }: any) => {
    const isCredit = item.receiverWalletId === wallet?.id;
    return (
      <View style={styles.transactionCard}>
        <View style={styles.iconCircle}>
          <Ionicons
            name={isCredit ? "arrow-down" : "arrow-up"}
            size={24}
            color={isCredit ? "#07C160" : "#E44D26"}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.transTitle}>{item.transactionType}</Text>
          <Text style={styles.transDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
        <Text style={[styles.transAmount, { color: isCredit ? "#07C160" : "#E44D26" }]}>
          {isCredit ? "+" : "-"}${item.amount.toFixed(2)}
        </Text>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#07C160" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      {/* Wallet Card */}
      <View style={styles.walletCard}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text style={styles.balanceAmount}>
          ${wallet?.balance?.toFixed(2) || '0.00'}
        </Text>
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="add" size={24} color="white" />
            <Text style={styles.actionText}>Top Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="card" size={24} color="white" />
            <Text style={styles.actionText}>Withdraw</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Transaction History */}
      <View style={styles.historyContainer}>
        <Text style={styles.sectionHeader}>Recent Transactions</Text>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={renderTransaction}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No recent transactions.</Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 16 },
  walletCard: {
    backgroundColor: '#07C160',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  balanceLabel: { color: '#E0E0E0', fontSize: 16, marginBottom: 8 },
  balanceAmount: { color: '#FFFFFF', fontSize: 36, fontWeight: 'bold', marginBottom: 24 },
  cardActions: { flexDirection: 'row', gap: 20 },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 10,
    borderRadius: 12,
    flex: 1,
    justifyContent: 'center'
  },
  actionText: { color: 'white', marginLeft: 8, fontWeight: '600' },
  historyContainer: { flex: 1 },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  transactionCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderTopColor: '#F0F0F0',
    borderBottomColor: '#EEEEEE',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transTitle: { fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
  transDate: { fontSize: 13, color: '#888', marginTop: 2 },
  transAmount: { fontSize: 16, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 40 },
});
