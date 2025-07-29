import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { Transaction, Category } from '@/types/expense';

export function exportToPDF(
  transactions: Transaction[],
  categories: Category[],
  type: 'income' | 'expense'
) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text(`${type === 'income' ? 'Income' : 'Expense'} Report`, 20, 30);
  
  // Date
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 20, 45);
  
  // Summary
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text(`Total ${type === 'income' ? 'Income' : 'Expenses'}: $${total.toFixed(2)}`, 20, 60);
  
  // Group transactions by category for the table
  const tableData: any[] = [];
  
  categories.forEach(category => {
    const categoryTransactions = transactions.filter(t => t.category === category.name);
    
    if (categoryTransactions.length > 0) {
      // Add category header
      tableData.push([
        { content: category.name, colSpan: 4, styles: { fillColor: [240, 240, 240], fontStyle: 'bold' } }
      ]);
      
      // Add transactions for this category
      categoryTransactions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .forEach(transaction => {
          tableData.push([
            format(new Date(transaction.date), 'MMM dd, yyyy'),
            `$${transaction.amount.toFixed(2)}`,
            transaction.description || '-',
            ''
          ]);
        });
      
      // Add category total
      const categoryTotal = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
      tableData.push([
        { content: '', colSpan: 1 },
        { content: `Subtotal: $${categoryTotal.toFixed(2)}`, colSpan: 3, styles: { fontStyle: 'bold' } }
      ]);
      
      // Add spacing
      tableData.push(['', '', '', '']);
    }
  });
  
  // Remove last empty row
  if (tableData.length > 0 && tableData[tableData.length - 1].every((cell: any) => cell === '')) {
    tableData.pop();
  }
  
  // Create table
  autoTable(doc, {
    startY: 80,
    head: [['Date', 'Amount', 'Description', '']],
    body: tableData,
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    headStyles: {
      fillColor: type === 'income' ? [76, 175, 80] : [255, 152, 0],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 249, 250],
    },
    margin: { top: 80, left: 20, right: 20 },
  });
  
  // Save the PDF
  const fileName = `${type}-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName);
}