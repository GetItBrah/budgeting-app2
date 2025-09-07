import React from 'react';
import { formatCurrency } from '../utils/helpers';

const EntryListItem = ({ entry, onEdit, onDelete, accountMap }) => {
    return (
        <li className="flex flex-wrap justify-between items-start gap-x-4 gap-y-2 bg-gray-900 p-4 rounded-lg border border-gray-700">
            {/* Left side: Description and pills */}
            <div className="min-w-0">
                <p className="font-semibold text-gray-200 break-words" title={entry.description}>
                    {entry.description}
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <p className="text-sm text-gray-400">{new Date(entry.timestamp).toLocaleDateString()}</p>
                    {accountMap[entry.accountId] && (
                        <span className="text-xs bg-blue-900 bg-opacity-50 text-blue-300 px-2 py-0.5 rounded-full border border-blue-800">
                            {accountMap[entry.accountId]}
                        </span>
                    )}
                    {entry.category && (
                        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full border border-gray-600">
                            {entry.category}
                        </span>
                    )}
                </div>
            </div>

            {/* Right side: Amount and buttons (will wrap to a new line on narrow screens) */}
            <div className="flex items-center flex-shrink-0">
                <p className={`font-bold whitespace-nowrap mr-2 ${entry.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                    {entry.type === 'income' ? '+' : '-'}{formatCurrency(entry.amount)}
                </p>
                <div className="flex items-center">
                    <button onClick={() => onEdit(entry)} className="p-1 text-gray-400 hover:text-blue-400" aria-label="Edit entry">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
                    </button>
                    <button onClick={() => onDelete(entry)} className="p-1 text-gray-400 hover:text-red-400" aria-label="Delete entry">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>
            </div>
        </li>
    );
};

export default EntryListItem;