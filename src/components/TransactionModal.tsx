import { useState, useEffect } from 'react';
import { Calendar, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Transaction, Category } from '@/types/expense';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  categories: Category[];
  type: 'income' | 'expense';
  editingTransaction?: Transaction | null;
}

export function TransactionModal({
  isOpen,
  onClose,
  onSubmit,
  categories,
  type,
  editingTransaction,
}: TransactionModalProps) {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    description: '',
    date: new Date(),
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        category: editingTransaction.category,
        amount: editingTransaction.amount.toString(),
        description: editingTransaction.description,
        date: new Date(editingTransaction.date),
      });
    } else {
      setFormData({
        category: '',
        amount: '',
        description: '',
        date: new Date(),
      });
    }
  }, [editingTransaction, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.amount) {
      return;
    }

    onSubmit({
      type,
      category: formData.category,
      amount: parseFloat(formData.amount),
      description: formData.description,
      date: formData.date.toISOString(),
    });

    onClose();
  };

  const handleClose = () => {
    setFormData({
      category: '',
      amount: '',
      description: '',
      date: new Date(),
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gradient-card border-0 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {editingTransaction ? 'Edit' : 'Add New'} {type === 'income' ? 'Income' : 'Expense'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border z-50">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              className="bg-background border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal bg-background border-border',
                    !formData.date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-background border-border z-50" align="start">
                <CalendarComponent
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => date && setFormData(prev => ({ ...prev, date }))}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter a description (optional)"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="bg-background border-border resize-none"
              rows={3}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!formData.category || !formData.amount}
              className={`${
                type === 'income' 
                  ? 'bg-success hover:bg-success-dark' 
                  : 'bg-warning hover:bg-warning-dark'
              } transition-all duration-200`}
            >
              {editingTransaction ? 'Update' : 'Add'} {type === 'income' ? 'Income' : 'Expense'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}