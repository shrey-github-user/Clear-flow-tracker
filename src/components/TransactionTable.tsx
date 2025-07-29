import { useState } from 'react';
import { format } from 'date-fns';
import { Edit, Trash2, Calendar, DollarSign, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Transaction, Category } from '@/types/expense';

interface TransactionTableProps {
  transactions: Transaction[];
  categories: Category[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionTable({
  transactions,
  categories,
  onEdit,
  onDelete,
}: TransactionTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Group transactions by category
  const transactionsByCategory = categories.reduce((acc, category) => {
    acc[category.name] = transactions.filter(t => t.category === category.name);
    return acc;
  }, {} as Record<string, Transaction[]>);

  const handleDelete = (id: string) => {
    onDelete(id);
    setDeletingId(null);
  };

  if (transactions.length === 0) {
    return (
      <Card className="bg-gradient-card border shadow-lg">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <DollarSign className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No transactions yet</h3>
          <p className="text-muted-foreground text-center">
            Get started by adding your first transaction using the "+" button above.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {categories.map((category) => {
          const categoryTransactions = transactionsByCategory[category.name] || [];
          const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);

          return (
            <Card key={category.id} className="bg-gradient-card border shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">{category.name}</CardTitle>
                  <Badge 
                    variant="secondary" 
                    className={`${
                      category.type === 'income' 
                        ? 'bg-success-light text-success-dark' 
                        : 'bg-warning-light text-warning-dark'
                    }`}
                  >
                    ${total.toFixed(2)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {categoryTransactions.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No transactions in this category</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {categoryTransactions
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((transaction) => (
                        <div
                          key={transaction.id}
                          className="bg-background rounded-lg p-3 border border-border hover:shadow-md transition-all duration-200 animate-fade-in"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <DollarSign className={`w-4 h-4 ${
                                  transaction.type === 'income' ? 'text-success' : 'text-warning'
                                }`} />
                                <span className="font-semibold text-foreground">
                                  ${transaction.amount.toFixed(2)}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                <Calendar className="w-3 h-3" />
                                {format(new Date(transaction.date), 'MMM dd, yyyy')}
                              </div>
                              
                              {transaction.description && (
                                <p className="text-sm text-muted-foreground truncate">
                                  {transaction.description}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-1 ml-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onEdit(transaction)}
                                className="h-8 w-8 p-0 hover:bg-primary/10"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 hover:bg-destructive/10 text-destructive"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-background border-border">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this transaction? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(transaction.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}