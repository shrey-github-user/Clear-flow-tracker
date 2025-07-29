import { useState } from 'react';
import { Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Category } from '@/types/expense';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (category: Omit<Category, 'id'>) => void;
  type: 'income' | 'expense';
}

export function CategoryModal({ isOpen, onClose, onSubmit, type }: CategoryModalProps) {
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryName.trim()) {
      return;
    }

    onSubmit({
      name: categoryName.trim(),
      type,
    });

    setCategoryName('');
    onClose();
  };

  const handleClose = () => {
    setCategoryName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gradient-card border-0 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Tag className={`w-5 h-5 ${type === 'income' ? 'text-success' : 'text-warning'}`} />
            Add New {type === 'income' ? 'Income' : 'Expense'} Category
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              id="categoryName"
              type="text"
              placeholder={`Enter ${type} category name`}
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="bg-background border-border"
              autoFocus
              required
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!categoryName.trim()}
              className={`${
                type === 'income' 
                  ? 'bg-success hover:bg-success-dark' 
                  : 'bg-warning hover:bg-warning-dark'
              } transition-all duration-200`}
            >
              Create Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}