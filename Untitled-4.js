import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpRight, ArrowDownLeft, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const getTransactionIcon = (type) => {
  switch (type) {
    case 'deposit':
    case 'transfer_received':
      return { icon: ArrowDownLeft, color: 'text-green-600', bg: 'bg-green-50' };
    case 'withdrawal':
    case 'transfer_sent':
      return { icon: ArrowUpRight, color: 'text-red-600', bg: 'bg-red-50' };
    default:
      return { icon: ArrowUpRight, color: 'text-blue-600', bg: 'bg-blue-50' };
  }
};

export default function History() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => base44.entities.Transaction.list("-created_date", 100),
  });

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.recipient?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Histórico de Transações
          </h1>
          <p className="text-slate-500">Visualize todas as suas movimentações</p>
        </div>

        <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-xl mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Buscar transações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="deposit">Depósitos</SelectItem>
                  <SelectItem value="withdrawal">Saques</SelectItem>
                  <SelectItem value="transfer_sent">Transferências Enviadas</SelectItem>
                  <SelectItem value="transfer_received">Transferências Recebidas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader className="border-b border-slate-200/60">
            <CardTitle className="text-slate-900">
              {filteredTransactions.length} {filteredTransactions.length === 1 ? 'transação' : 'transações'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-slate-500">Nenhuma transação encontrada</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredTransactions.map((transaction) => {
                  const { icon: Icon, color, bg } = getTransactionIcon(transaction.type);
                  const isPositive = transaction.type === 'deposit' || transaction.type === 'transfer_received';
                  
                  return (
                    <div 
                      key={transaction.id} 
                      className="p-4 hover:bg-slate-50 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-6 h-6 ${color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 truncate">
                            {transaction.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <p className="text-xs text-slate-500">
                              {format(new Date(transaction.created_date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </p>
                            {transaction.recipient && (
                              <>
                                <span className="text-slate-300">•</span>
                                <p className="text-xs text-slate-500">
                                  {transaction.recipient}
                                </p>
                              </>
                            )}
                            {transaction.category && (
                              <>
                                <span className="text-slate-300">•</span>
                                <p className="text-xs text-slate-500 capitalize">
                                  {transaction.category}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className={`font-bold text-lg ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {isPositive ? '+' : '-'}R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {format(new Date(transaction.created_date), "HH:mm")}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}