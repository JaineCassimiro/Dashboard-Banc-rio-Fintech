import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BalanceCard({ balance, monthlyChange }) {
  const [showBalance, setShowBalance] = React.useState(true);

  return (
    <Card className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 border-none shadow-2xl shadow-blue-500/30 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl -ml-24 -mb-24" />
      
      <CardContent className="p-8 relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-blue-100 text-sm font-medium mb-2">Saldo disponível</p>
            <div className="flex items-baseline gap-2">
              {showBalance ? (
                <h2 className="text-4xl md:text-5xl font-bold text-white">
                  R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
              ) : (
                <h2 className="text-4xl md:text-5xl font-bold text-white">R$ •••••</h2>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowBalance(!showBalance)}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </Button>
        </div>

        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 w-fit">
          {monthlyChange >= 0 ? (
            <>
              <TrendingUp className="w-4 h-4 text-green-300" />
              <span className="text-green-300 text-sm font-medium">
                +R$ {Math.abs(monthlyChange).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </>
          ) : (
            <>
              <TrendingDown className="w-4 h-4 text-red-300" />
              <span className="text-red-300 text-sm font-medium">
                -R$ {Math.abs(monthlyChange).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </>
          )}
          <span className="text-white/70 text-sm">este mês</span>
        </div>
      </CardContent>
    </Card>
  );
}