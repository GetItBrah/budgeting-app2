import React from 'react';
import EntryListItem from './EntryListItem';

const DashboardView = ({
    userEmail, onSettingsClick, onLogout,
    selectedDate, months, handlePreviousMonth, handleNextMonth, handlePreviousYear, handleNextYear,
    totalIncome, totalExpenses, balance, formatCurrency,
    onAddIncome, onAddExpense, onExportCSV, onExportPDF,
    payPeriodSettings, currentPayPeriod, handlePreviousPayPeriod, handleNextPayPeriod,
    upcomingBills, handleOpenPayModal, totalUpcomingBills,
    paidBillsThisPayPeriod, handleUnpayBill, totalPaidBills,
    incomeEntries, expenseEntries,
    searchTerm, setSearchTerm,
    handleEditEntry, handleDeleteEntry,
    accountMap
}) => (
    <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-200">Budget Dashboard</h1>
                <p className="text-sm text-gray-400">Signed in as: {userEmail || 'N/A'}</p>
            </div>
            {/* --- HIDE ON MOBILE --- */}
            <div className="hidden md:flex items-center gap-2">
                <button 
                    onClick={onSettingsClick} 
                    className="p-2 rounded-full hover:bg-gray-700 transition-colors" 
                    aria-label="Settings"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
                <button 
                    onClick={onLogout} 
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-4 rounded-lg text-sm"
                >
                    Sign Out
                </button>
            </div>
        </div>

        {/* Monthly Overview Section */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4 md:p-6">
            <h2 className="text-xl font-bold text-center mb-4">Monthly Overview</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-4 mb-6">
                <div className="flex items-center gap-2">
                    <button onClick={handlePreviousMonth} className="p-1 rounded-full hover:bg-gray-700 transition-colors" aria-label="Previous month">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h3 className="text-lg font-semibold text-center w-28">{months[selectedDate.getMonth()]}</h3>
                    <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-gray-700 transition-colors" aria-label="Next month">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handlePreviousYear} className="p-1 rounded-full hover:bg-gray-700 transition-colors" aria-label="Previous year">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <h3 className="text-lg font-semibold text-center w-20">{selectedDate.getFullYear()}</h3>
                    <button onClick={handleNextYear} className="p-1 rounded-full hover:bg-gray-700 transition-colors" aria-label="Next year">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="bg-gray-900 px-4 py-2 rounded-xl shadow-md flex flex-col justify-center text-center">
                    <span className="text-base font-semibold text-gray-400 leading-tight">Income</span>
                    <span className="text-xl font-bold text-green-400 leading-tight">{formatCurrency(totalIncome)}</span>
                </div>
                <div className="bg-gray-900 px-4 py-2 rounded-xl shadow-md flex flex-col justify-center text-center">
                    <span className="text-base font-semibold text-gray-400 leading-tight">Expenses</span>
                    <span className="text-xl font-bold text-red-400 leading-tight">{formatCurrency(totalExpenses)}</span>
                </div>
                <div className="bg-gray-900 px-4 py-2 rounded-xl shadow-md flex flex-col justify-center text-center">
                    <span className="text-base font-semibold text-gray-400 leading-tight">Balance</span>
                    <span className={`text-xl font-bold leading-tight ${balance >= 0 ? 'text-gray-200' : 'text-red-400'}`}>
                        {formatCurrency(balance)}
                    </span>
                </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3 mt-6">
                <button onClick={onAddIncome} className="bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 px-4 rounded-lg text-sm">
                    Add Income
                </button>
                <button onClick={onAddExpense} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-4 rounded-lg text-sm">
                    Add Expense
                </button>
                <button onClick={onExportCSV} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1.5 px-4 rounded-lg text-sm">
                    Download CSV
                </button>
                <button onClick={onExportPDF} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-4 rounded-lg text-sm">
                    Export PDF
                </button>
            </div>
        </div>

        {/* Search + Transactions */}
        <div className="space-y-8">
            <input 
                type="text" 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                placeholder="Search transactions..." 
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500" 
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pay Period */}
                <div className="lg:col-span-1 bg-gray-800 border border-gray-700 rounded-2xl p-4 space-y-3 h-fit">
                    <div className="flex justify-between items-center">
                        <button onClick={handlePreviousPayPeriod} disabled={!payPeriodSettings.lastPayDate} className="p-1 rounded-full hover:bg-gray-700 disabled:opacity-50">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <div className="text-center">
                            <h2 className="text-lg font-bold text-gray-300">Pay Period Bills</h2>
                            {currentPayPeriod.start && currentPayPeriod.end ? (
                                <p className="text-xs text-gray-400">{currentPayPeriod.start.toLocaleDateString()} - {currentPayPeriod.end.toLocaleDateString()}</p>
                            ) : (
                                <p className="text-xs text-gray-400">Set pay period in Settings</p>
                            )}
                        </div>
                        <button onClick={handleNextPayPeriod} disabled={!payPeriodSettings.lastPayDate} className="p-1 rounded-full hover:bg-gray-700 disabled:opacity-50">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-400 text-sm mb-2">Upcoming</h3>
                        <div className="space-y-2">
                            {upcomingBills.length > 0 ? (
                                upcomingBills.map(bill => (
                                    <div key={bill.displayId} className="flex justify-between items-center bg-gray-900 p-2 rounded-lg">
                                        <div className="flex items-center">
                                            <button onClick={() => handleOpenPayModal(bill)} className="p-1 mr-2 text-gray-500 hover:text-green-400">
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </button>
                                            <div>
                                                <p className="text-sm font-medium">{bill.description}</p>
                                                <p className="text-xs text-gray-500">Due: {bill.timestamp.toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-semibold text-red-400">{formatCurrency(bill.amount)}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-3 text-sm">All bills paid for this period!</p>
                            )}
                        </div>
                        {upcomingBills.length > 0 && (
                            <div className="mt-3 pt-2 border-t border-gray-700 text-right">
                                <p className="font-semibold text-base">Total Due: <span className="text-red-400">{formatCurrency(totalUpcomingBills)}</span></p>
                            </div>
                        )}
                    </div>
                    {paidBillsThisPayPeriod.length > 0 && (
                        <div className="pt-3 border-t border-gray-700">
                            <h3 className="font-semibold text-gray-400 text-sm mb-2">Paid This Period</h3>
                            <div className="space-y-2">
                                {paidBillsThisPayPeriod.map(bill => (
                                    <div key={bill.displayId} className="flex justify-between items-center bg-gray-900 p-2 rounded-lg opacity-60">
                                        <div className="flex items-center">
                                            <button onClick={() => handleUnpayBill(bill)} className="p-1 mr-2 text-gray-500 hover:text-yellow-400">
                                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </button>
                                            <div>
                                                <p className="text-sm font-medium line-through">{bill.description}</p>
                                                <p className="text-xs text-gray-500">Due: {bill.timestamp.toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-semibold text-green-400 line-through">{formatCurrency(bill.paidAmount)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-700 text-right">
                                <p className="font-semibold text-base">Total Paid: <span className="text-green-400">{formatCurrency(totalPaidBills)}</span></p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Income */}
                <div className="lg:col-span-1 bg-gray-800 border border-gray-700 rounded-2xl p-4">
                    <h2 className="text-lg font-bold mb-3">Income</h2>
                    <ul className="space-y-2 overflow-y-auto pr-2 custom-scrollbar max-h-96">
                        {incomeEntries.length > 0
                            ? incomeEntries.map(entry => (
                                <EntryListItem 
                                    key={entry.displayId || entry.id} 
                                    entry={entry} 
                                    onEdit={handleEditEntry} 
                                    onDelete={handleDeleteEntry} 
                                    accountMap={accountMap} 
                                />
                            ))
                            : <li className="text-center text-gray-400 py-4 text-sm">No income found for this month.</li>}
                    </ul>
                </div>

                {/* Expenses */}
                <div className="lg:col-span-1 bg-gray-800 border border-gray-700 rounded-2xl p-4">
                    <h2 className="text-lg font-bold mb-3">Expenses</h2>
                    <ul className="space-y-2 overflow-y-auto pr-2 custom-scrollbar max-h-96">
                        {expenseEntries.length > 0
                            ? expenseEntries.map(entry => (
                                <EntryListItem 
                                    key={entry.displayId || entry.id} 
                                    entry={entry} 
                                    onEdit={handleEditEntry} 
                                    onDelete={handleDeleteEntry} 
                                    accountMap={accountMap} 
                                />
                            ))
                            : <li className="text-center text-gray-400 py-4 text-sm">No expenses found for this month.</li>}
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

export default DashboardView;
