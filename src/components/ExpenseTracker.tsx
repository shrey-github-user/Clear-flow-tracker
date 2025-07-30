import { useState } from 'react';
import { Plus, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Transaction, Category, ExpenseStore } from '@/types/expense';
import { TransactionModal } from './TransactionModal';
import { TransactionTable } from './TransactionTable';
import { CategoryModal } from './CategoryModal';
import { exportToPDF } from '@/utils/pdfExport';
import { toast } from '@/hooks/use-toast';

const defaultCategories: Category[] = [
  { id: '1', name: 'Salary', type: 'income' },
  { id: '2', name: 'Freelance', type: 'income' },
  { id: '3', name: 'Food', type: 'expense' },
  { id: '4', name: 'Transportation', type: 'expense' },
  { id: '5', name: 'Entertainment', type: 'expense' },
  { id: '6', name: 'Utilities', type: 'expense' },
];

export function ExpenseTracker() {
  const [store, setStore] = useLocalStorage<ExpenseStore>('expense-tracker', {
    transactions: [],
    categories: defaultCategories,
  });

  const [currentView, setCurrentView] = useState<'income' | 'expense'>('expense');
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const filteredTransactions = store.transactions.filter(t => t.type === currentView);
  const filteredCategories = store.categories.filter(c => c.type === currentView);

  const totalIncome = store.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = store.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setStore(prev => ({
      ...prev,
      transactions: [...prev.transactions, newTransaction],
    }));

    toast({
      title: "Transaction added successfully",
      description: `${transaction.type === 'income' ? 'Income' : 'Expense'} of ₹${transaction.amount} added.`,
    });
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setStore(prev => ({
      ...prev,
      transactions: prev.transactions.map(t => 
        t.id === id ? { ...t, ...updates } : t
      ),
    }));

    toast({
      title: "Transaction updated successfully",
    });
  };

  const deleteTransaction = (id: string) => {
    setStore(prev => ({
      ...prev,
      transactions: prev.transactions.filter(t => t.id !== id),
    }));

    toast({
      title: "Transaction deleted successfully",
    });
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };

    setStore(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));

    toast({
      title: "Category created successfully",
      description: `${category.name} category added.`,
    });
  };

  const handleExportToPDF = () => {
    try {
      exportToPDF(filteredTransactions, filteredCategories, currentView);
      toast({
        title: "PDF exported successfully",
        description: `${currentView === 'income' ? 'Income' : 'Expense'} report downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error generating the PDF.",
        variant: "destructive",
      });
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsTransactionModalOpen(false);
    setEditingTransaction(null);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Expense Tracker</h1>
          <p className="text-muted-foreground text-lg">Manage your finances with ease</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-success border-0 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalIncome.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-warning border-0 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 opacity-90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalExpense.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-primary border-0 text-white ${balance < 0 ? 'bg-gradient-to-r from-red-500 to-red-600' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{balance.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="bg-gradient-card border shadow-lg">
          <CardContent className="p-4 md:p-6">
            {/* Mobile Layout - Stacked vertically */}
            <div className="flex flex-col space-y-4 md:hidden">
              {/* Toggle Switch - Centered on mobile */}
              <div className="flex justify-center">
                <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg">
                  <Button
                    variant={currentView === 'income' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrentView('income')}
                    className={`transition-all duration-300 ease-bounce ${
                      currentView === 'income' 
                        ? 'bg-success text-success-foreground shadow-md' 
                        : 'hover:bg-background'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Income
                  </Button>
                  <Button
                    variant={currentView === 'expense' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCurrentView('expense')}
                    className={`transition-all duration-300 ease-bounce ${
                      currentView === 'expense' 
                        ? 'bg-warning text-warning-foreground shadow-md' 
                        : 'hover:bg-background'
                    }`}
                  >
                    <TrendingDown className="w-4 h-4 mr-2" />
                    Expenses
                  </Button>
                </div>
              </div>

              {/* Action Buttons - Full width on mobile */}
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => setIsCategoryModalOpen(true)}
                  variant="outline"
                  size="sm"
                  className="w-full transition-all duration-200 hover:scale-105"
                >
                  Add Category
                </Button>
                <Button
                  onClick={handleExportToPDF}
                  variant="outline"
                  size="sm"
                  disabled={filteredTransactions.length === 0}
                  className="w-full transition-all duration-200 hover:scale-105"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
                <Button
                  onClick={() => setIsTransactionModalOpen(true)}
                  className={`w-full transition-all duration-200 hover:scale-105 ${
                    currentView === 'income' 
                      ? 'bg-success hover:bg-success-dark' 
                      : 'bg-warning hover:bg-warning-dark'
                  }`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add {currentView === 'income' ? 'Income' : 'Expense'}
                </Button>
              </div>
            </div>

            {/* Desktop Layout - Spread across width */}
            <div className="hidden md:flex items-center justify-between">
              {/* Toggle Switch - Left side */}
              <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg">
                <Button
                  variant={currentView === 'income' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('income')}
                  className={`transition-all duration-300 ease-bounce ${
                    currentView === 'income' 
                      ? 'bg-success text-success-foreground shadow-md' 
                      : 'hover:bg-background'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Income
                </Button>
                <Button
                  variant={currentView === 'expense' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView('expense')}
                  className={`transition-all duration-300 ease-bounce ${
                    currentView === 'expense' 
                      ? 'bg-warning text-warning-foreground shadow-md' 
                      : 'hover:bg-background'
                    }`}
                >
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Expenses
                </Button>
              </div>

              {/* Action Buttons - Right side */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setIsCategoryModalOpen(true)}
                  variant="outline"
                  size="sm"
                  className="transition-all duration-200 hover:scale-105"
                >
                  Add Category
                </Button>
                <Button
                  onClick={handleExportToPDF}
                  variant="outline"
                  size="sm"
                  disabled={filteredTransactions.length === 0}
                  className="transition-all duration-200 hover:scale-105"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
                <Button
                  onClick={() => setIsTransactionModalOpen(true)}
                  className={`transition-all duration-200 hover:scale-105 ${
                    currentView === 'income' 
                      ? 'bg-success hover:bg-success-dark' 
                      : 'bg-warning hover:bg-warning-dark'
                  }`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add {currentView === 'income' ? 'Income' : 'Expense'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <TransactionTable
          transactions={filteredTransactions}
          categories={filteredCategories}
          onEdit={handleEditTransaction}
          onDelete={deleteTransaction}
        />

        {/* Modals */}
        <TransactionModal
          isOpen={isTransactionModalOpen}
          onClose={handleCloseModal}
          onSubmit={editingTransaction ? 
            (data) => updateTransaction(editingTransaction.id, data) : 
            addTransaction
          }
          categories={filteredCategories}
          type={currentView}
          editingTransaction={editingTransaction}
        />

        <CategoryModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          onSubmit={addCategory}
          type={currentView}
        />
      </div>
    </div>
  );
}