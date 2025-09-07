import React, { useState, useEffect } from 'react';

const PayBillModal = ({ onClose, onSave, onSkip, bill }) => {
    const [paidAmount, setPaidAmount] = useState('');
    const [paidDate, setPaidDate] = useState('');

    useEffect(() => {
        if (bill) {
            setPaidAmount(bill.amount);
            setPaidDate(new Date().toISOString().split('T')[0]);
        }
    }, [bill]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            originalBill: bill,
            paidAmount: parseFloat(paidAmount),
            paidDate: new Date(paidDate),
        });
    };

    if (!bill) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose} className="modal-close-btn" aria-label="Close modal"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                <h2 className="text-2xl font-bold mb-2 text-center text-gray-200">Confirm Payment</h2>
                <p className="text-center text-gray-400 mb-6">{bill.description}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="paidAmount" className="block text-sm font-medium text-gray-300 mb-1">Amount Paid</label>
                            <input type="number" id="paidAmount" value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} required min="0.01" step="0.01" className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label htmlFor="paidDate" className="block text-sm font-medium text-gray-300 mb-1">Payment Date</label>
                            <input type="date" id="paidDate" value={paidDate} onChange={(e) => setPaidDate(e.target.value)} required className="w-full p-2 border rounded-lg" />
                        </div>
                    </div>
                    <div className="flex justify-between items-center gap-4 mt-6">
                        {bill.isRecurring && <button type="button" onClick={() => onSkip(bill)} className="py-2 px-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">Skip This Payment</button>}
                        <div className="flex gap-2 ml-auto">
                            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-600 text-gray-200 rounded-lg hover:bg-gray-700">Cancel</button>
                            <button type="submit" className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700">Confirm Payment</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PayBillModal;