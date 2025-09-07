import React, { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';

const SettingsModal = ({ onClose, onSave, currentSettings }) => {
    const [lastPayDate, setLastPayDate] = useState('');
    const [frequency, setFrequency] = useState('bi-weekly');

    useEffect(() => {
        if (currentSettings.lastPayDate) {
            const date = new Date(currentSettings.lastPayDate.getTime());
            setLastPayDate(date.toISOString().split('T')[0]);
        }
        if (currentSettings.frequency) {
            setFrequency(currentSettings.frequency);
        }
    }, [currentSettings]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!lastPayDate) {
            alert("Please select a last pay date.");
            return;
        }
        const [year, month, day] = lastPayDate.split('-').map(Number);
        const localDate = new Date(Date.UTC(year, month - 1, day));
        const dateObject = Timestamp.fromDate(localDate);
        onSave({ lastPayDate: dateObject, frequency });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose} className="modal-close-btn" aria-label="Close modal"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-200">Pay Period Settings</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="lastPayDate" className="block text-sm font-medium text-gray-300 mb-1">Last Pay Date</label>
                        <input type="date" id="lastPayDate" value={lastPayDate} onChange={(e) => setLastPayDate(e.target.value)} required className="w-full p-2 border rounded-lg" />
                    </div>
                    <div>
                        <label htmlFor="frequency" className="block text-sm font-medium text-gray-300 mb-1">Pay Frequency</label>
                        <select id="frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full p-2 border rounded-lg">
                            <option value="weekly">Weekly</option>
                            <option value="bi-weekly">Bi-Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="annually">Annually</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-600 text-gray-200 rounded-lg hover:bg-gray-700">Cancel</button>
                        <button type="submit" className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsModal;