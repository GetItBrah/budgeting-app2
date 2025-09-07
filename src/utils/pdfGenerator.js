import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from './helpers';

export const generatePdf = (reportTitle, entries, totalIncome, totalExpenses, balance, accountMap) => {
    const doc = new jsPDF();
    const today = new Date();
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.get('height');
    const tableColumns = ["Date", "Description", "Category", "Account", "Amount"];
    
    // Map entries to an array of objects to preserve type information for styling
    const mappedEntries = entries.map(entry => ({
        date: new Date(entry.timestamp).toLocaleDateString(),
        description: entry.description,
        category: entry.category || 'N/A',
        account: accountMap[entry.accountId] || 'N/A',
        amount: formatCurrency(entry.amount),
        type: entry.type
    }));

    // ---- PDF Header ----
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text("Budget Report", 14, 22);
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.text(reportTitle, 14, 30);

    // ---- PDF Table ----
    autoTable(doc, {
        head: [tableColumns],
        body: mappedEntries.map(e => [e.date, e.description, e.category, e.account, e.amount]),
        startY: 40,
        theme: 'grid',
        headStyles: { 
            fillColor: [31, 41, 55], // gray-800
            textColor: [243, 244, 246] // gray-100
        },
        didDrawCell: (data) => {
            // Color income/expense text in the 'Amount' column
            if (data.column.index === 4 && data.cell.section === 'body') {
                const entry = mappedEntries[data.row.index];
                const text = entry.type === 'income' ? `+${entry.amount}` : `-${entry.amount}`;
                
                // Clear the cell and manually draw the colored text
                doc.setFillColor(255, 255, 255); // White background
                doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
                
                if (entry.type === 'income') {
                    doc.setTextColor(34, 197, 94); // Green
                } else {
                    doc.setTextColor(239, 68, 68); // Red
                }
                doc.text(text, data.cell.x + data.cell.padding('left'), data.cell.y + data.cell.height / 2, {
                    baseline: 'middle'
                });
            }
        },
        willDrawCell: () => {
             doc.setTextColor(41, 51, 61); // Reset to default text color for all other cells
        }
    });

    // ---- PDF Summary ----
    const finalY = doc.lastAutoTable.finalY;
    doc.setFontSize(12);
    doc.text("Summary:", 14, finalY + 15);

    doc.setFont(undefined, 'normal');
    doc.text(`Total Income:`, 14, finalY + 22);
    doc.text(`${formatCurrency(totalIncome)}`, 60, finalY + 22);

    doc.text(`Total Expenses:`, 14, finalY + 29);
    doc.text(`${formatCurrency(totalExpenses)}`, 60, finalY + 29);
    
    doc.setFont(undefined, 'bold');
    doc.text(`Final Balance:`, 14, finalY + 38);
    doc.text(`${formatCurrency(balance)}`, 60, finalY + 38);
    
    // ---- PDF Footer ----
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 25, pageHeight - 10);
        doc.text(`Generated on: ${today.toLocaleDateString()}`, 14, pageHeight - 10);
    }

    // ---- Save Document ----
    const fileName = `${reportTitle.replace(/ /g, '_')}.pdf`;
    doc.save(fileName);
};