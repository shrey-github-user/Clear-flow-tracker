💸 Transactly - Income & Expense Tracker

Transactly is a modern, full-stack expense and income tracker web application with a seamless UI, category-based tracking, and PDF export functionality.

────────────────────────────
📁 Project Structure
────────────────────────────

transactly/
├── frontend/         → React-based frontend (JSX)
├── backend/          → Express.js backend (JS)
└── README.txt

────────────────────────────
🚀 Features
────────────────────────────

- Toggle switch to switch between Income and Expense views
- Add new transactions with:
    • Category (linked to type)
    • Date
    • Amount
    • Short description
- Transactions displayed in rounded-corner tables, separated by category columns
- Create and manage custom categories
- Download transaction records as a PDF
- Smooth transitions and responsive, clean UI

────────────────────────────
🛠️ Getting Started
────────────────────────────

1. Clone the repository:

   git clone https://github.com/yourusername/transactly.git
   cd transactly

2. Start the frontend:

   npm install
   npm run dev

   → Runs on: http://localhost:8080

────────────────────────────
⚙️ Tech Stack
────────────────────────────

Frontend:   React (JSX), CSS, Axios  
Backend:    Node.js, Express.js  
Exporting:  jsPDF or html2pdf.js  
Storage:    JSON or MongoDB (optional)  
UI:         Clean layout, soft shadows, smooth transitions

────────────────────────────
🗂 Folder Overview
────────────────────────────

+---public
|       favicon.ico
|       placeholder.svg
|
\---src
    |   App.css
    |   App.tsx
    |   index.css
    |   main.tsx
    |   vite-env.d.ts
    |
    +---components
    |   |   CategoryModal.tsx
    |   |   ExpenseTracker.tsx
    |   |   TransactionModal.tsx
    |   |   TransactionTable.tsx
    |   |
    |   \---ui
    |           accordion.tsx
    |           alert-dialog.tsx
    |           alert.tsx
    |           aspect-ratio.tsx
    |           avatar.tsx
    |           badge.tsx
    |           breadcrumb.tsx
    |           button.tsx
    |           calendar.tsx
    |           card.tsx
    |           carousel.tsx
    |           chart.tsx
    |           checkbox.tsx
    |           collapsible.tsx
    |           command.tsx
    |           context-menu.tsx
    |           dialog.tsx
    |           drawer.tsx
    |           dropdown-menu.tsx
    |           form.tsx
    |           hover-card.tsx
    |           input-otp.tsx
    |           input.tsx
    |           label.tsx
    |           menubar.tsx
    |           navigation-menu.tsx
    |           pagination.tsx
    |           popover.tsx
    |           progress.tsx
    |           radio-group.tsx
    |           resizable.tsx
    |           scroll-area.tsx
    |           select.tsx
    |           separator.tsx
    |           sheet.tsx
    |           sidebar.tsx
    |           skeleton.tsx
    |           slider.tsx
    |           sonner.tsx
    |           switch.tsx
    |           table.tsx
    |           tabs.tsx
    |           textarea.tsx
    |           toast.tsx
    |           toaster.tsx
    |           toggle-group.tsx
    |           toggle.tsx
    |           tooltip.tsx
    |           use-toast.ts
    |
    +---hooks
    |       use-mobile.tsx
    |       use-toast.ts
    |       useLocalStorage.ts
    |
    |
    +---lib
    |       utils.ts
    |
    +---pages
    |       Index.tsx
    |       NotFound.tsx
    |
    +---types
    |       expense.ts
    |
    \---utils
            pdfExport.ts


────────────────────────────
📬 Contact
────────────────────────────

For support: [shreykumarlm25@gmail.com]  
Project by: [Shrey Makwana]
