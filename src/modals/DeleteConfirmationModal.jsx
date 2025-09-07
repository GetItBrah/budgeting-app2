import React from 'react';

const DeleteConfirmationModal = ({ onClose, onConfirmDeleteAll, onConfirmDeleteFuture, item }) => {
    if (!item) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose} className="modal-close-btn" aria-label="Close"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                <h2 className="text-2xl font-bold mb-2 text-center text-gray-200">Delete Recurring Item</h2>
                <p className="text-center text-gray-400 mb-6">You are deleting "<span className="font-semibold text-gray-200">{item.description}</span>". How would you like to proceed?</p>
                <div className="space-y-3">
                    <div className="flex gap-3">
                        <button onClick={onConfirmDeleteFuture} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition-colors">Delete Future Only</button>
                        <button onClick={onConfirmDeleteAll} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors">Delete All</button>
                    </div>
                    <button onClick={onClose} className="w-full bg-gray-600 hover:bg-gray-700 text-gray-200 font-bold py-2 rounded-lg transition-colors">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;