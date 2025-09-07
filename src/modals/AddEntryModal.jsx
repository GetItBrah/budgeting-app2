import React, { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import { PREDEFINED_INCOME_CATEGORIES, PREDEFINED_EXPENSE_CATEGORIES } from '../utils/helpers';

const AddEntryModal = ({ onClose, onAddEntry, onUpdateEntry, initialType, entryToEdit, accounts }) => {
    const [type, setType] = useState(initialType);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurrenceFrequency, setRecurrenceFrequency] = useState('monthly');
    const [updateAllFuture, setUpdateAllFuture] = useState(true);
    const [category, setCategory] = useState('');
    const [customCategory, setCustomCategory] = useState('');
    const [accountId, setAccountId] = useState('');

    useEffect(() => {
        if (entryToEdit) {
            setType(entryToEdit.type);
            setDescription(entryToEdit.description);
            setAmount(entryToEdit.amount);
            setDate(new Date(entryToEdit.timestamp.seconds ? entryToEdit.timestamp.seconds * 1000 : entryToEdit.timestamp).toISOString().split('T')[0]);
            setIsRecurring(entryToEdit.isRecurring);
            setRecurrenceFrequency(entryToEdit.recurrenceFrequency || 'monthly');
            setAccountId(entryToEdit.accountId || '');

            const existingCategory = entryToEdit.category || '';
            const categoryList = entryToEdit.type === 'income' ? PREDEFINED_INCOME_CATEGORIES : PREDEFINED_EXPENSE_CATEGORIES;

            if (categoryList.includes(existingCategory)) {
                setCategory(existingCategory);
                setCustomCategory('');
            } else if (existingCategory) {
                setCategory('add_new');
                setCustomCategory(existingCategory);
            } else {
                setCategory('');
                setCustomCategory('');
            }
        } else if (accounts.length > 0) {
            setAccountId(accounts[0].id);
        }
    }, [entryToEdit, accounts]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const [year, month, day] = date.split('-').map(Number);
        const localDate = new Date(year, month - 1, day);
        const timestamp = Timestamp.fromDate(localDate);
        
        const finalCategory = category === 'add_new' ? customCategory.trim() : category;

        const entryData = {
            type,
            description,
            amount: parseFloat(amount),
            timestamp,
            isRecurring,
            recurrenceFrequency: isRecurring ? recurrenceFrequency : null,
            category: finalCategory,
            accountId,
        };

        if (entryToEdit) {
            const updatedData = { ...entryData, paidDates: entryToEdit.paidDates || [], skippedDates: entryToEdit.skippedDates || [] };
            onUpdateEntry(entryToEdit.id, updatedData, entryToEdit, updateAllFuture);
        } else {
            const newData = { ...entryData, cancellationDate: null, paidDates: [], skippedDates: [] }
            onAddEntry(newData);
        }
        onClose();
    };
    
    const categoryList = type === 'income' ? PREDEFINED_INCOME_CATEGORIES : PREDEFINED_EXPENSE_CATEGORIES;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose} className="modal-close-btn" aria-label="Close modal"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-200">{entryToEdit ? 'Edit' : 'Add'} {type === 'income' ? 'Income' : 'Expense'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                        <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full p-2 border rounded-lg"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
                            <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required min="0.01" step="0.01" className="w-full p-2 border rounded-lg"/>
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                            <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full p-2 border rounded-lg"/>
                        </div>
                    </div>
                    
                     <div>
                        <label htmlFor="account" className="block text-sm font-medium text-gray-300 mb-1">Account</label>
                        <select id="account" value={accountId} onChange={(e) => setAccountId(e.target.value)} className="w-full p-2 border rounded-lg" required>
                            {accounts.length === 0 ? (
                                <option value="">Please add an account first</option>
                            ) : (
                                accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)
                            )}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded-lg">
                            <option value="">Select a Category</option>
                            {categoryList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            <option value="add_new">-- Add New Category --</option>
                        </select>
                    </div>

                    {category === 'add_new' && (
                        <div>
                            <label htmlFor="customCategory" className="block text-sm font-medium text-gray-300 mb-1">New Category Name</label>
                            <input type="text" id="customCategory" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} placeholder="e.g., Side Hustle" className="w-full p-2 border rounded-lg" required />
                        </div>
                    )}

                    <div className="flex items-center">
                        <input type="checkbox" id="isRecurring" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"/>
                        <label htmlFor="isRecurring" className="ml-2 text-sm font-medium text-gray-300">Is this a recurring transaction?</label>
                    </div>

                    {isRecurring && (
                        <div>
                            <label htmlFor="recurrenceFrequency" className="block text-sm font-medium text-gray-300 mb-1">Frequency</label>
                            <select id="recurrenceFrequency" value={recurrenceFrequency} onChange={(e) => setRecurrenceFrequency(e.target.value)} className="w-full p-2 border rounded-lg">
                                <option value="weekly">Weekly</option><option value="bi-weekly">Bi-Weekly</option><option value="every-4-weeks">Every 4 Weeks</option><option value="monthly">Monthly</option><option value="annually">Annually</option>
                            </select>
                        </div>
                    )}

                    {entryToEdit && entryToEdit.isRecurring && (
                        <div className="bg-gray-700 p-3 rounded-lg"><p className="text-sm font-medium text-gray-200 mb-2">Apply changes to:</p>
                            <div className="flex items-center mb-2">
                                <input type="radio" id="updateAllFuture" name="updateScope" checked={updateAllFuture} onChange={() => setUpdateAllFuture(true)} className="h-4 w-4"/>
                                <label htmlFor="updateAllFuture" className="ml-2 text-sm text-gray-300">All occurrences</label>
                            </div>
                            <div className="flex items-center">
                                <input type="radio" id="updateThisOnly" name="updateScope" checked={!updateAllFuture} onChange={() => setUpdateAllFuture(false)} className="h-4 w-4"/>
                                <label htmlFor="updateThisOnly" className="ml-2 text-sm text-gray-300">This and future occurrences</label>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-600 text-gray-200 rounded-lg hover:bg-gray-700">Cancel</button>
                        <button type="submit" className={`py-2 px-4 text-white rounded-lg ${type === 'income' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>{entryToEdit ? 'Update' : 'Add'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEntryModal;