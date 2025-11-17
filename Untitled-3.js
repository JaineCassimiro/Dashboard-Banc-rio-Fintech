import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus, Lock, Unlock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const CardItem = ({ card, onToggleStatus }) => {
  const brandColors = {
    visa: 'from-blue-600 to-blue-800',
    mastercard: 'from-orange-600 to-red-600',
    elo: 'from-yellow-600 to-yellow-700',
  };

  return (
    <Card className={`bg-gradient-to-br ${brandColors[card.brand] || 'from-slate-700 to-slate-900'} border-none shadow-2xl overflow-hidden relative`}>
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mr-24 -mt-24" />
      <CardContent className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div className="text-white/80 text-sm font-medium uppercase tracking-wider">
            {card.card_type === 'credit' ? 'Crédito' : 'Débito'}
          </div>
          <CreditCard className="w-8 h-8 text-white/60" />
        </div>

        <div className="mb-8">
          <div className="text-white/60 text-xs mb-1">Número do cartão</div>
          <div className="text-white text-xl font-mono tracking-wider">
            •••• •••• •••• {card.card_number}
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <div className="text-white/60 text-xs mb-1">Titular</div>
            <div className="text-white text-sm font-medium uppercase">
              {card.card_holder}
            </div>
          </div>
          <div>
            <div className="text-white/60 text-xs mb-1">Validade</div>
            <div className="text-white text-sm font-mono">
              {card.expiry_date}
            </div>
          </div>
          <div>
            <Button
              size="icon"
              variant="ghost"
              className="text-white/80 hover:text-white hover:bg-white/10"
              onClick={() => onToggleStatus(card)}
            >
              {card.is_active ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {card.card_type === 'credit' && card.limit && (
          <div className="mt-6 pt-4 border-t border-white/20">
            <div className="text-white/60 text-xs mb-1">Limite disponível</div>
            <div className="text-white text-lg font-semibold">
              R$ {card.limit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
        )}

        {!card.is_active && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="text-center">
              <Lock className="w-12 h-12 text-white/60 mx-auto mb-2" />
              <p className="text-white font-medium">Cartão Bloqueado</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function Cards() {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    card_number: '',
    card_holder: '',
    card_type: 'debit',
    brand: 'visa',
    expiry_date: '',
    limit: '',
  });

  const { data: cards = [], isLoading } = useQuery({
    queryKey: ['cards'],
    queryFn: () => base44.entities.Card.list("-created_date"),
  });

  const createCardMutation = useMutation({
    mutationFn: (data) => base44.entities.Card.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['cards']);
      setShowDialog(false);
      setFormData({
        card_number: '',
        card_holder: '',
        card_type: 'debit',
        brand: 'visa',
        expiry_date: '',
        limit: '',
      });
      toast.success('Cartão adicionado com sucesso!');
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, is_active }) => base44.entities.Card.update(id, { is_active: !is_active }),
    onSuccess: () => {
      queryClient.invalidateQueries(['cards']);
      toast.success('Status atualizado!');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      limit: formData.limit ? parseFloat(formData.limit) : undefined,
    };
    createCardMutation.mutate(data);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Meus Cartões</h1>
            <p className="text-slate-500">Gerencie seus cartões de crédito e débito</p>
          </div>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Cartão
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Cartão</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Últimos 4 dígitos</Label>
                  <Input
                    maxLength={4}
                    value={formData.card_number}
                    onChange={(e) => setFormData({ ...formData, card_number: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nome no cartão</Label>
                  <Input
                    value={formData.card_holder}
                    onChange={(e) => setFormData({ ...formData, card_holder: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select value={formData.card_type} onValueChange={(v) => setFormData({ ...formData, card_type: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debit">Débito</SelectItem>
                        <SelectItem value="credit">Crédito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Bandeira</Label>
                    <Select value={formData.brand} onValueChange={(v) => setFormData({ ...formData, brand: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visa">Visa</SelectItem>
                        <SelectItem value="mastercard">Mastercard</SelectItem>
                        <SelectItem value="elo">Elo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Validade (MM/AA)</Label>
                  <Input
                    placeholder="12/25"
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                    required
                  />
                </div>
                {formData.card_type === 'credit' && (
                  <div className="space-y-2">
                    <Label>Limite</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.limit}
                      onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                    />
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={createCardMutation.isPending}>
                  {createCardMutation.isPending ? 'Salvando...' : 'Salvar Cartão'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 bg-slate-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : cards.length === 0 ? (
          <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <CreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Nenhum cartão cadastrado
              </h3>
              <p className="text-slate-500 mb-6">
                Adicione seu primeiro cartão para começar
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <CardItem
                key={card.id}
                card={card}
                onToggleStatus={(card) => toggleStatusMutation.mutate(card)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}