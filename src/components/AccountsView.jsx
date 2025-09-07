import React from 'react';

const AccountsView = ({ accountsWithBalances, netWorth, onAddAccount, formatCurrency }) => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-200">Accounts</h1>
                <button onClick={onAddAccount} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Add New Account
                </button>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center">
                <h2 className="text-lg font-semibold text-gray-400">Total Net Worth</h2>
                <p className={`text-4xl font-bold ${netWorth >= 0 ? 'text-white' : 'text-red-400'}`}>{formatCurrency(netWorth)}</p>
            </div>

            {accountsWithBalances.length === 0 ? (
                <div className="text-center py-10 bg-gray-800 border border-gray-700 rounded-lg">
                    <p className="text-gray-400">You haven't added any accounts yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {accountsWithBalances.map(account => (
                        <div key={account.id} className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <p className="font-bold text-lg text-gray-200">{account.name}</p>
                                <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">{account.type}</span>
                            </div>
                            <div className="mt-4 text-right">
                                <p className="text-xs text-gray-400">Current Balance</p>
                                <p className={`text-2xl font-semibold ${account.currentBalance >= 0 ? 'text-gray-200' : 'text-red-400'}`}>
                                    {formatCurrency(account.currentBalance)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AccountsView;