import React, { useState } from 'react';

const AddAccountModal = ({ onClose, onSave }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('Checking');
    const [startingBalance, setStartingBalance] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            name,
            type,
            startingBalance: parseFloat(startingBalance) || 0,
        });
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose} className="modal-close-btn" aria-label="Close modal"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-200">Add a New Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="accountName" className="block text-sm font-medium text-gray-300 mb-1">Account Name</label>
                        <input type="text" id="accountName" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Chase Checking" required className="w-full p-2 border rounded-lg"/>
                    </div>
                     <div>
                        <label htmlFor="accountType" className="block text-sm font-medium text-gray-300 mb-1">Account Type</label>
                        <select id="accountType" value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2 border rounded-lg">
                            <option>Checking</option>
                            <option>Savings</option>
                            <option>Credit Card</option>
                            <option>Cash</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="startingBalance" className="block text-sm font-medium text-gray-300 mb-1">Starting Balance</label>
                        <input type="number" id="startingBalance" value={startingBalance} onChange={(e) => setStartingBalance(e.target.value)} placeholder="0.00" required step="0.01" className="w-full p-2 border rounded-lg"/>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-600 text-gray-200 rounded-lg hover:bg-gray-700">Cancel</button>
                        <button type="submit" className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Account</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAccountModal;