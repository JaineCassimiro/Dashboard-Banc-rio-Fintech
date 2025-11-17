# Dashboard-Banc-rio-Fintech
A. Dashboard (Untitled-1.ts) Atua como o hub central. 
Markdown

# 🏦 Fintech Dashboard

Um painel bancário moderno e responsivo desenvolvido com **React**, focado em uma experiência de usuário fluida, design clean (Glassmorphism) e gerenciamento eficiente de estado assíncrono.

![Project Status](https://img.shields.io/badge/status-em_desenvolvimento-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Sobre o Projeto

Este projeto simula a interface de um banco digital ("Fintech"), permitindo ao usuário visualizar saldo, gerenciar cartões de crédito/débito, realizar transferências e acompanhar o histórico de transações. O foco principal é a arquitetura de componentes e a fidelidade visual.

## 🚀 Funcionalidades Principais

### 📊 Dashboard Geral
- **Resumo Financeiro:** Visualização do saldo atual e variação mensal (receitas vs despesas).
- **Modo Privacidade:** Funcionalidade para esconder/mostrar o saldo com um clique.
- **Cálculo em Tempo Real:** O saldo é calculado dinamicamente baseado no histórico de transações carregado da API.

### 💳 Gestão de Cartões
- **Visualização Realista:** Os cartões mudam de cor e estilo automaticamente baseados na bandeira (Visa, Mastercard, Elo).
- **Bloqueio de Segurança:** Permite bloquear e desbloquear cartões temporariamente, com feedback visual imediato (ícone de cadeado).
- **Novo Cartão:** Formulário modal para adicionar novos cartões de crédito ou débito.

### 💸 Transações e Transferências
- **Histórico Detalhado:** Lista de transações com busca inteligente (por nome ou descrição) e filtros por tipo de operação (depósito, saque, transferência).
- **Identificação Visual:** Ícones e cores distintas para entradas (verde) e saídas (vermelho).
- **Fluxo de Transferência:** Interface dedicada para envio de valores com validação de formulário e feedback de sucesso.

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando as melhores práticas e ferramentas do ecossistema React moderno:

- **Core:** [React](https://react.dev/) (Hooks & Functional Components)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) (Responsividade e Design System)
- **Gerenciamento de Estado/Server:** [TanStack Query (React Query)](https://tanstack.com/query/latest) para caching e atualizações otimistas.
- **Ícones:** [Lucide React](https://lucide.dev/).
- **Datas:** [date-fns](https://date-fns.org/) para formatação de datas em PT-BR.
- **UI Components:** Baseado em Shadcn/ui (Radix Primitives).
- **Notificações:** Sonner (Toasts).

## 📂 Estrutura de Dados

O projeto utiliza esquemas bem definidos para garantir a integridade dos dados:

* **Transaction:** Controla tipos (`deposit`, `withdrawal`, `transfer`), valores, destinatários e categorias.
* **Card:** Gerencia dados sensíveis como últimos dígitos, validade, limites e status de bloqueio (`is_active`).

## 🎨 Design System

O projeto utiliza uma estética moderna com:
* **Glassmorphism:** Uso extensivo de transparências e *backdrop-blur* para criar profundidade.
* **Gradientes:** Cores vibrantes para diferenciar cartões e ações.
* **Interatividade:** Efeitos de *hover*, *scale* e transições suaves em todos os elementos clicáveis.

## 🏁 Como Rodar o Projeto

1. **Clone o repositório**
   ```bash
   git clone [https://github.com/seu-usuario/fintech-dashboard.git](https://github.com/seu-usuario/fintech-dashboard.git)
Instale as dependências

Bash

npm install
# ou
yarn install
Inicie o servidor de desenvolvimento

Bash

npm run dev
Acesse no navegador O projeto estará rodando em http://localhost:5173 (ou a porta definida pelo Vite).

🔜 Próximos Passos
[ ] Implementar tela de PIX (QRCode e Copia e Cola).

[ ] Adicionar gráficos detalhados de gastos por categoria.

[ ] Implementar modo escuro (Dark Mode).

[ ] Integração completa com Backend real.
