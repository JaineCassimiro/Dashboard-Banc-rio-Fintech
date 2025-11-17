import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import BalanceCard from "../components/dashboard/BalanceCard";
import QuickActions from "../components/dashboard/QuickActions";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import SpendingChart from "../components/dashboard/SpendingChart";

export default function Dashboard() {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => base44.entities.Transaction.list("-created_date", 50),
  });

  const calculateBalance = () => {
    return transactions.reduce((acc, t) => {
      if (t.type === 'deposit' || t.type === 'transfer_received') {
        return acc + t.amount;
      } else {
        return acc - t.amount;
      }
    }, 0);
  };

  const calculateMonthlyChange = () => {
    const now = new Date();
    const thisMonth = transactions.filter(t => {
      const transactionDate = new Date(t.created_date);
      return transactionDate.getMonth() === now.getMonth() && 
             transactionDate.getFullYear() === now.getFullYear();
    });

    return thisMonth.reduce((acc, t) => {
      if (t.type === 'deposit' || t.type === 'transfer_received') {
        return acc + t.amount;
      } else {
        return acc - t.amount;
      }
    }, 0);
  };

  const balance = calculateBalance();
  const monthlyChange = calculateMonthlyChange();
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
          Olá, bem-vindo!
        </h1>
        <p className="text-slate-500">Aqui está um resumo da sua conta</p>
      </div>

      <BalanceCard balance={balance} monthlyChange={monthlyChange} />

      <QuickActions />

      <div className="grid lg:grid-cols-2 gap-6">
        <RecentTransactions transactions={recentTransactions} isLoading={isLoading} />
        <SpendingChart transactions={transactions} />
      </div>
    </div>
  );
}