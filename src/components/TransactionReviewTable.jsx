import React, { useState, useEffect } from 'react';
import { PREDEFINED_INCOME_CATEGORIES, PREDEFINED_EXPENSE_CATEGORIES } from '../utils/helpers';

const TransactionReviewTable = ({ data, accounts, onSave, onCancel }) => {
    const [transactions, setTransactions] = useState([]);
    
    const RECURRENCE_OPTIONS = [
        { value: 'weekly', label: 'Weekly' },
        { value: 'bi-weekly', label: 'Bi-Weekly' },
        { value: '4-weeks', label: 'Every 4 Weeks' },
        { value: 'monthly', label: 'Monthly' },
        { value: 'annually', label: 'Annually' }
    ];

    useEffect(() => {
        const processedData = data
            .map((row, index) => {
                const dateKey = Object.keys(row).find(k => k.toLowerCase().includes('date')) || '';
                const descKey = Object.keys(row).find(k => k.toLowerCase().includes('desc') || k.toLowerCase().includes('payee')) || '';
                
                const creditKey = Object.keys(row).find(k => k.toLowerCase().includes('credit')) || '';
                const debitKey = Object.keys(row).find(k => k.toLowerCase().includes('debit')) || '';
                const amountKey = Object.keys(row).find(k => k.toLowerCase().includes('amount')) || '';

                let amount = 0;
                let type = 'expense';

                if (creditKey && parseFloat(row[creditKey]) > 0) {
                    amount = parseFloat(row[creditKey]) || 0;
                    type = 'income';
                } else if (debitKey && parseFloat(row[debitKey]) > 0) {
                    amount = parseFloat(row[debitKey]) || 0;
                    type = 'expense';
                } else if (amountKey) {
                    const parsedAmount = parseFloat(String(row[amountKey]).replace(/[^0-9.-]+/g,"")) || 0;
                    amount = Math.abs(parsedAmount);
                    if (parsedAmount >= 0) type = 'income';
                }

                if (amount === 0) return null;

                return {
                    id: index,
                    include: true,
                    date: row[dateKey] ? new Date(row[dateKey]).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    description: row[descKey] || '',
                    amount: amount,
                    type: type,
                    accountId: accounts.length > 0 ? accounts[0].id : '',
                    category: '',
                    isRecurring: false,
                    recurrenceFrequency: 'bi-weekly',
                };
            })
            .filter(Boolean);

        setTransactions(processedData);
    }, [data, accounts]);

    const handleTransactionChange = (id, field, value) => {
        setTransactions(prev =>
            prev.map(t => (t.id === id ? { ...t, [field]: value } : t))
        );
    };

    const handleSaveClick = () => {
        const transactionsToSave = transactions.filter(t => t.include);
        onSave(transactionsToSave);
    };

    const handleToggleAll = (e) => {
        const { checked } = e.target;
        setTransactions(prev => prev.map(t => ({ ...t, include: checked })));
    };

    const categoryList = (type) => type === 'income' ? PREDEFINED_INCOME_CATEGORIES : PREDEFINED_EXPENSE_CATEGORIES;

    // --- RENDER LOGIC ---
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Review Your Transactions</h2>

            <div className="flex items-center gap-3 p-3 bg-gray-900 rounded-lg">
                <input 
                    type="checkbox" 
                    className="form-checkbox" 
                    checked={transactions.length > 0 && transactions.every(t => t.include)} 
                    onChange={handleToggleAll} 
                />
                <label className="font-semibold text-gray-300">
                    Select All ({transactions.filter(t => t.include).length} / {transactions.length})
                </label>
            </div>
            
            <ul className="space-y-2">
                {transactions.map(t => (
                    <li key={t.id} className="bg-gray-800 rounded-lg p-2 border border-gray-700 flex flex-wrap items-center gap-1.5">
                        {/* Checkbox */}
                        <div>
                            <input type="checkbox" className="form-checkbox" checked={t.include} onChange={(e) => handleTransactionChange(t.id, 'include', e.target.checked)} />
                        </div>
                        {/* Date */}
                        <div style={{width: '135px'}}>
                            <input type="date" value={t.date} onChange={(e) => handleTransactionChange(t.id, 'date', e.target.value)} className="form-input-sm" />
                        </div>
                        {/* Description */}
                        <div className="flex-auto" style={{minWidth: '150px'}}>
                            <input type="text" value={t.description} onChange={(e) => handleTransactionChange(t.id, 'description', e.target.value)} className="form-input-sm font-semibold" placeholder="Description" />
                        </div>
                        {/* Amount */}
                        <div style={{width: '100px'}}>
                            <input type="number" step="0.01" value={t.amount} onChange={(e) => handleTransactionChange(t.id, 'amount', parseFloat(e.target.value))} className={`form-input-sm text-right font-bold ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`} />
                        </div>
                        {/* Type */}
                        <div style={{width: '110px'}}>
                            <select value={t.type} onChange={(e) => handleTransactionChange(t.id, 'type', e.target.value)} className="form-input-sm">
                                <option value="expense">Expense</option><option value="income">Income</option>
                            </select>
                        </div>
                        {/* Account */}
                        <div className="flex-auto" style={{minWidth: '140px'}}>
                            <select value={t.accountId} onChange={(e) => handleTransactionChange(t.id, 'accountId', e.target.value)} className="form-input-sm">
                                {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                            </select>
                        </div>
                        {/* Category */}
                        <div className="flex-auto" style={{minWidth: '140px'}}>
                            <select value={t.category} onChange={(e) => handleTransactionChange(t.id, 'category', e.target.value)} className="form-input-sm">
                                <option value="">Select Category</option>{categoryList(t.type).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        {/* Recurring */}
                        <div className="flex items-center gap-2 p-1.5 bg-gray-700 rounded-md">
                            <input type="checkbox" id={`rec-${t.id}`} checked={t.isRecurring} onChange={(e) => handleTransactionChange(t.id, 'isRecurring', e.target.checked)} className="form-checkbox" />
                            <label htmlFor={`rec-${t.id}`} className="text-xs text-gray-300 pr-1 select-none">Recurring</label>
                        </div>
                        {/* Frequency */}
                        <div style={{width: '120px'}}>
                            <select value={t.recurrenceFrequency} onChange={(e) => handleTransactionChange(t.id, 'recurrenceFrequency', e.target.value)} className="form-input-sm disabled:opacity-50" disabled={!t.isRecurring}>
                                {RECURRENCE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                            </select>
                        </div>
                    </li>
                ))}
            </ul>

            <div className="flex justify-end gap-4 mt-6">
                <button onClick={onCancel} className="py-2 px-4 bg-gray-600 text-gray-200 rounded-lg hover:bg-gray-700">Cancel</button>
                <button onClick={handleSaveClick} className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700">Import {transactions.filter(t => t.include).length} Transactions</button>
            </div>
        </div>
    );
};

export default TransactionReviewTable;