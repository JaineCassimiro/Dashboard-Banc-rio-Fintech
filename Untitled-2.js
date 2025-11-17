import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeftRight, Send, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";

export default function Transfer() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    description: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const transferMutation = useMutation({
    mutationFn: async (data) => {
      await base44.entities.Transaction.create({
        type: 'transfer_sent',
        amount: parseFloat(data.amount),
        description: data.description || `Transferência para ${data.recipient}`,
        recipient: data.recipient,
        status: 'completed',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
      setShowSuccess(true);
      setTimeout(() => {
        navigate(createPageUrl('Dashboard'));
      }, 2000);
    },
    onError: () => {
      toast.error('Erro ao realizar transferência');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.recipient || !formData.amount) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    if (parseFloat(formData.amount) <= 0) {
      toast.error('Valor deve ser maior que zero');
      return;
    }
    transferMutation.mutate(formData);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-2xl">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Transferência Realizada!
            </h2>
            <p className="text-slate-600 mb-1">
              R$ {parseFloat(formData.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-slate-500">
              para {formData.recipient}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <ArrowLeftRight className="w-8 h-8" />
            Nova Transferência
          </h1>
          <p className="text-slate-500">Envie dinheiro de forma rápida e segura</p>
        </div>

        <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader className="border-b border-slate-200/60">
            <CardTitle className="text-slate-900">Dados da Transferência</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="recipient">Destinatário *</Label>
                <Input
                  id="recipient"
                  placeholder="Nome do destinatário"
                  value={formData.recipient}
                  onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Valor *</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                    R$
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="h-12 pl-12 text-lg font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  placeholder="Adicione uma mensagem..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="h-24"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate(createPageUrl('Dashboard'))}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                  disabled={transferMutation.isPending}
                >
                  {transferMutation.isPending ? (
                    <>Processando...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Transferir
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}