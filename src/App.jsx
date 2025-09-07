import React, { useState, useEffect, useMemo } from 'react';

// Firebase and Config
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, signOut } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, collection, addDoc, updateDoc, deleteDoc, writeBatch, arrayUnion, arrayRemove, setDoc, Timestamp } from 'firebase/firestore';
import { firebaseConfig, appId } from './firebaseConfig';

// Helper Functions
import { getNextDate, formatCurrency } from './utils/helpers';
import { generatePdf } from './utils/pdfGenerator';

// Components
import TailwindStyles from './components/TailwindStyles';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import AccountsView from './components/AccountsView';
import YearlySummaryView from './components/YearlySummaryView';
import ImportView from './components/ImportView';

// Modals
import AddEntryModal from './modals/AddEntryModal';
import AddAccountModal from './modals/AddAccountModal';
import PayBillModal from './modals/PayBillModal';
import DeleteConfirmationModal from './modals/DeleteConfirmationModal';
import SettingsModal from './modals/SettingsModal';

const App = () => {
    // --- State Variables ---
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [entries, setEntries] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [email, setEmail] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('expense');
    const [editingEntry, setEditingEntry] = useState(null);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [payPeriodSettings, setPayPeriodSettings] = useState({ lastPayDate: null, frequency: 'bi-weekly' });
    const [currentPayPeriod, setCurrentPayPeriod] = useState({ start: null, end: null });
    const [isPayBillModalOpen, setIsPayBillModalOpen] = useState(false);
    const [billToPay, setBillToPay] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [currentView, setCurrentView] = useState('dashboard');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // --- Firebase & Auth ---
    useEffect(() => {
        const app = initializeApp(firebaseConfig);
        const authInstance = getAuth(app);
        const dbInstance = getFirestore(app);
        setAuth(authInstance);
        setDb(dbInstance);

        const unsubscribe = onAuthStateChanged(authInstance, (user) => {
            if (user) {
                setUserId(user.uid);
                setUserEmail(user.email);
            } else if (isSignInWithEmailLink(authInstance, window.location.href)) {
                let email = window.localStorage.getItem('emailForSignIn');
                if (!email) {
                    email = window.prompt('Please provide your email for confirmation');
                }
                setAuthLoading(true);
                signInWithEmailLink(authInstance, email, window.location.href)
                    .then((result) => {
                        window.localStorage.removeItem('emailForSignIn');
                        setUserId(result.user.uid);
                        setUserEmail(result.user.email);
                    })
                    .catch((error) => setError(error.message))
                    .finally(() => setAuthLoading(false));
            } else {
                setUserId(null);
                setUserEmail(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // --- Data Fetching ---
    useEffect(() => {
        if (!db || !userId) return;

        const unsubEntries = onSnapshot(collection(db, `artifacts/${appId}/users/${userId}/budgetEntries`), (snapshot) => {
            setEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }, (err) => { console.error("Error fetching entries:", err); setError("Could not fetch budget entries."); });

        const unsubSettings = onSnapshot(doc(db, `artifacts/${appId}/users/${userId}`), (doc) => {
            if (doc.exists() && doc.data().payPeriodSettings) {
                const { lastPayDate, frequency } = doc.data().payPeriodSettings;
                if (lastPayDate) {
                    setPayPeriodSettings({ lastPayDate: lastPayDate.toDate(), frequency: frequency || 'bi-weekly' });
                }
            }
        }, (err) => { console.error("Error fetching settings:", err); setError("Could not fetch user settings."); });

        const unsubAccounts = onSnapshot(collection(db, `artifacts/${appId}/users/${userId}/accounts`), (snapshot) => {
            setAccounts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }, (err) => { console.error("Error fetching accounts:", err); setError("Could not fetch accounts."); });

        return () => { unsubEntries(); unsubSettings(); unsubAccounts(); };
    }, [db, userId]);

    // --- Side Effects ---
    useEffect(() => {
        if (payPeriodSettings.lastPayDate) {
            const start = new Date(payPeriodSettings.lastPayDate.getTime());
            start.setHours(0, 0, 0, 0);
            const end = getNextDate(start, payPeriodSettings.frequency);
            end.setMilliseconds(end.getMilliseconds() - 1);
            setCurrentPayPeriod({ start, end });
        }
    }, [payPeriodSettings]);

    useEffect(() => {
        if (message || error) {
            const timer = setTimeout(() => { setMessage(null); setError(null); }, 4000);
            return () => clearTimeout(timer);
        }
    }, [message, error]);
    
    // --- Memoized Calculations ---
    const displayedEntries = useMemo(() => {
        const currentMonth = selectedDate.getMonth();
        const currentYear = selectedDate.getFullYear();
        return entries.flatMap(entry => {
            if (!entry.timestamp?.toDate) return [];
            const startDate = entry.timestamp.toDate();
            if (!entry.isRecurring) {
                return startDate.getMonth() === currentMonth && startDate.getFullYear() === currentYear ? [{ ...entry, timestamp: startDate }] : [];
            }
            const instances = [];
            let currentDate = new Date(startDate.getTime());
            const cancelDate = entry.cancellationDate?.toDate();
            while (currentDate.getFullYear() < currentYear + 2) {
                if (cancelDate && currentDate > cancelDate) break;
                if (currentDate.getMonth() === currentMonth && currentDate.getFullYear() === currentYear) {
                    instances.push({ ...entry, timestamp: new Date(currentDate.getTime()), displayId: `${entry.id}-${currentDate.getTime()}` });
                }
                if (currentDate.getFullYear() > currentYear && currentDate.getMonth() > currentMonth) break;
                const nextDate = getNextDate(currentDate, entry.recurrenceFrequency);
                if (nextDate.getTime() === currentDate.getTime()) break;
                currentDate = nextDate;
            }
            return instances;
        }).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    }, [selectedDate, entries]);

    const { totalIncome, totalExpenses, balance } = useMemo(() => {
        return displayedEntries.reduce((acc, entry) => {
            if (entry.type === 'income') acc.totalIncome += entry.amount;
            else acc.totalExpenses += entry.amount;
            acc.balance = acc.totalIncome - acc.totalExpenses;
            return acc;
        }, { totalIncome: 0, totalExpenses: 0, balance: 0 });
    }, [displayedEntries]);
    
    const filteredDisplayedEntries = useMemo(() => {
        if (!searchTerm) return displayedEntries;
        return displayedEntries.filter(entry =>
            entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (entry.category && entry.category.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm, displayedEntries]);

    const incomeEntries = useMemo(() => filteredDisplayedEntries.filter(e => e.type === 'income'), [filteredDisplayedEntries]);
    const expenseEntries = useMemo(() => filteredDisplayedEntries.filter(e => e.type === 'expense'), [filteredDisplayedEntries]);

    const allBillsThisPayPeriod = useMemo(() => {
        if (!currentPayPeriod.start || !currentPayPeriod.end) return [];
        const instances = [];
        const allExpenses = entries.filter(e => e.type === 'expense');
        allExpenses.forEach(expense => {
            if (!expense.timestamp?.toDate) return;
            const startDate = expense.timestamp.toDate();
            const cancelDate = expense.cancellationDate?.toDate();
            const paidDates = expense.paidDates || [];
            const skippedDates = expense.skippedDates || [];
            if (expense.isRecurring) {
                let currentDate = new Date(startDate.getTime());
                while (currentDate <= currentPayPeriod.end) {
                    if (cancelDate && currentDate > cancelDate) break;
                    if (currentDate >= currentPayPeriod.start) {
                        const ymd = currentDate.toISOString().split('T')[0];
                        const paymentRecord = paidDates.find(p => p.dueDate === ymd);
                        const isSkipped = skippedDates.includes(ymd);
                        instances.push({ ...expense, timestamp: new Date(currentDate.getTime()), displayId: `${expense.id}-${currentDate.getTime()}`, isPaid: !!paymentRecord, isSkipped, paidAmount: paymentRecord ? paymentRecord.paidAmount : null, paidDateString: ymd });
                    }
                    const nextDate = getNextDate(currentDate, expense.recurrenceFrequency);
                    if (nextDate.getTime() === currentDate.getTime()) break;
                    currentDate = nextDate;
                }
            } else {
                const expenseDate = startDate;
                if (expenseDate >= currentPayPeriod.start && expenseDate <= currentPayPeriod.end) {
                    const ymd = expenseDate.toISOString().split('T')[0];
                    const paymentRecord = paidDates.find(p => p.dueDate === ymd);
                    const isSkipped = skippedDates.includes(ymd);
                    instances.push({ ...expense, timestamp: expenseDate, isPaid: !!paymentRecord, isSkipped, paidAmount: paymentRecord ? paymentRecord.paidAmount : null, paidDateString: ymd });
                }
            }
        });
        return instances.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    }, [entries, currentPayPeriod]);

    const upcomingBills = useMemo(() => allBillsThisPayPeriod.filter(bill => !bill.isPaid && !bill.isSkipped), [allBillsThisPayPeriod]);
    const paidBillsThisPayPeriod = useMemo(() => allBillsThisPayPeriod.filter(bill => bill.isPaid), [allBillsThisPayPeriod]);
    const totalUpcomingBills = useMemo(() => upcomingBills.reduce((acc, bill) => acc + bill.amount, 0), [upcomingBills]);
    const totalPaidBills = useMemo(() => paidBillsThisPayPeriod.reduce((acc, bill) => acc + (bill.paidAmount || bill.amount), 0), [paidBillsThisPayPeriod]);

    const accountMap = useMemo(() => {
        return accounts.reduce((acc, account) => {
            acc[account.id] = account.name;
            return acc;
        }, {});
    }, [accounts]);

    const accountsWithBalances = useMemo(() => {
        return accounts.map(account => {
            const relevantEntries = entries.filter(entry => entry.accountId === account.id);
            const balance = relevantEntries.reduce((sum, entry) => {
                if (entry.type === 'income') {
                    return sum + entry.amount;
                }
                return sum - entry.amount;
            }, account.startingBalance);
            return { ...account, currentBalance: balance };
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, [accounts, entries]);

    const netWorth = useMemo(() => {
        return accountsWithBalances.reduce((sum, account) => {
            if (account.type === 'Credit Card') {
                return sum - account.currentBalance;
            }
            return sum + account.currentBalance;
        }, 0);
    }, [accountsWithBalances]);
    
    // --- Handlers ---
    const handleSendMagicLink = async (e) => { e.preventDefault(); if (!auth || !email) return; setAuthLoading(true); setMessage(null); setError(null); try { await sendSignInLinkToEmail(auth, email, { url: window.location.href, handleCodeInApp: true, }); window.localStorage.setItem('emailForSignIn', email); setMessage(`Sign-in link sent to ${email}!`); } catch (error) { setError(error.message); } finally { setAuthLoading(false); } };
    const handleLogout = async () => { if (!auth) return; setAuthLoading(true); await signOut(auth); setAuthLoading(false); };
    const handleAddEntry = async (entryData) => { if (!db || !userId) return; try { await addDoc(collection(db, `artifacts/${appId}/users/${userId}/budgetEntries`), entryData); setMessage(`${entryData.type.charAt(0).toUpperCase() + entryData.type.slice(1)} added successfully!`); } catch (e) { setError("Could not add entry."); } };
    const handleUpdateEntry = async (id, updatedData, originalEntry, updateAllFuture) => { if (!db || !userId) return; try { const docRef = doc(db, `artifacts/${appId}/users/${userId}/budgetEntries`, id); if (originalEntry.isRecurring && !updateAllFuture) { const batch = writeBatch(db); const dayBefore = new Date(originalEntry.timestamp.getTime()); dayBefore.setDate(dayBefore.getDate() - 1); batch.update(docRef, { cancellationDate: Timestamp.fromDate(dayBefore) }); const newRecurringEntry = { ...updatedData, timestamp: Timestamp.fromDate(originalEntry.timestamp) }; delete newRecurringEntry.id; delete newRecurringEntry.paidDates; delete newRecurringEntry.skippedDates; const newDocRef = doc(collection(db, `artifacts/${appId}/users/${userId}/budgetEntries`)); batch.set(newDocRef, newRecurringEntry); await batch.commit(); } else { await updateDoc(docRef, updatedData); } setMessage("Entry updated successfully!"); } catch (e) { setError("Could not update entry."); } };
    const handleDeleteAll = async (itemId) => { if (!db || !userId) return; try { await deleteDoc(doc(db, `artifacts/${appId}/users/${userId}/budgetEntries`, itemId)); setMessage("Entry deleted successfully."); } catch (e) { setError("Could not delete entry."); } setIsDeleteModalOpen(false); };
    const handleDeleteFuture = async (item) => { if (!db || !userId) return; try { const docRef = doc(db, `artifacts/${appId}/users/${userId}/budgetEntries`, item.id); const cancellationDate = Timestamp.fromDate(new Date(item.timestamp)); await updateDoc(docRef, { cancellationDate }); setMessage("Future occurrences cancelled."); } catch (e) { setError("Could not update entry."); } setIsDeleteModalOpen(false); };
    const handleConfirmPayment = async ({ originalBill, paidAmount }) => { if (!db || !userId) return; try { const docRef = doc(db, `artifacts/${appId}/users/${userId}/budgetEntries`, originalBill.id); const dueDateString = new Date(originalBill.timestamp).toISOString().split('T')[0]; const newPaymentRecord = { dueDate: dueDateString, paidAmount: paidAmount }; await updateDoc(docRef, { paidDates: arrayUnion(newPaymentRecord) }); setMessage(`${originalBill.description} marked as paid.`); setIsPayBillModalOpen(false); setBillToPay(null); } catch (e) { setError("Could not confirm payment."); } };
    const handleUnpayBill = async (bill) => { if (!db || !userId) return; try { const docRef = doc(db, `artifacts/${appId}/users/${userId}/budgetEntries`, bill.id); const paymentRecordToRemove = { dueDate: bill.paidDateString, paidAmount: bill.paidAmount }; await updateDoc(docRef, { paidDates: arrayRemove(paymentRecordToRemove) }); setMessage("Payment status reverted."); } catch (e) { setError("Could not revert payment status."); } };
    const handleSkipPayment = async (bill) => { if (!db || !userId) return; try { const docRef = doc(db, `artifacts/${appId}/users/${userId}/budgetEntries`, bill.id); const dueDateString = new Date(bill.timestamp).toISOString().split('T')[0]; await updateDoc(docRef, { skippedDates: arrayUnion(dueDateString) }); setMessage(`${bill.description} skipped for this period.`); } catch (e) { setError("Could not skip payment."); } };
    const handleSaveSettings = async (settings) => { if (!db || !userId) return; try { await setDoc(doc(db, `artifacts/${appId}/users/${userId}`), { payPeriodSettings: settings }, { merge: true }); setPayPeriodSettings({ ...settings, lastPayDate: settings.lastPayDate.toDate() }); setIsSettingsModalOpen(false); } catch (e) { setError("Could not save settings."); } };
    const handleAddAccount = async (accountData) => { if (!db || !userId) return; try { await addDoc(collection(db, `artifacts/${appId}/users/${userId}/accounts`), accountData); setMessage('Account added successfully!'); } catch (e) { setError("Could not add account."); } };
    const handlePreviousMonth = () => setSelectedDate(d => { const n = new Date(d); n.setMonth(n.getMonth() - 1); return n; });
    const handleNextMonth = () => setSelectedDate(d => { const n = new Date(d); n.setMonth(n.getMonth() + 1); return n; });
    const handlePreviousYear = () => setSelectedDate(d => { const n = new Date(d); n.setFullYear(n.getFullYear() - 1); return n; });
    const handleNextYear = () => setSelectedDate(d => { const n = new Date(d); n.setFullYear(n.getFullYear() + 1); return n; });
    const handlePreviousPayPeriod = () => { const { lastPayDate, frequency } = payPeriodSettings; if (!lastPayDate) return; let newStartDate; switch (frequency) { case 'weekly': newStartDate = new Date(lastPayDate.getTime() - 7 * 86400000); break; case 'bi-weekly': newStartDate = new Date(lastPayDate.getTime() - 14 * 86400000); break; case 'monthly': newStartDate = new Date(new Date(lastPayDate).setMonth(lastPayDate.getMonth() - 1)); break; case 'annually': newStartDate = new Date(new Date(lastPayDate).setFullYear(lastPayDate.getFullYear() - 1)); break; default: return; } setPayPeriodSettings(prev => ({ ...prev, lastPayDate: newStartDate })); };
    const handleNextPayPeriod = () => { const { lastPayDate, frequency } = payPeriodSettings; if (!lastPayDate) return; setPayPeriodSettings(prev => ({ ...prev, lastPayDate: getNextDate(lastPayDate, frequency) })); };
    
    const handleExportCSV = () => {
        if (displayedEntries.length === 0) {
            alert("No data to export.");
            return;
        }

        const title = `Budget Report - ${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
        const headers = ["Date", "Description", "Category", "Account", "Type", "Amount"];
        
        const escapeCsvField = (field) => {
            if (field === null || field === undefined) return '';
            const str = String(field);
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        const rows = displayedEntries.map(entry => [
            new Date(entry.timestamp).toLocaleDateString(),
            entry.description,
            entry.category || '',
            accountMap[entry.accountId] || '',
            entry.type,
            entry.amount.toFixed(2)
        ].map(escapeCsvField));

        const summary = [
            [''],
            ['Summary'],
            ['Total Income', `"${formatCurrency(totalIncome)}"`],
            ['Total Expenses', `"${formatCurrency(totalExpenses)}"`],
            ['Final Balance', `"${formatCurrency(balance)}"`],
        ].map(row => row.map(escapeCsvField));

        let csvString = `${title}\n\n`;
        csvString += headers.join(',') + '\n';
        rows.forEach(row => { csvString += row.join(',') + '\n'; });
        summary.forEach(row => { csvString += row.join(',') + '\n'; });

        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${title.replace(/ /g, '_')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const handleOpenPayModal = (bill) => { setBillToPay(bill); setIsPayBillModalOpen(true); };
    const handleEditEntry = (entry) => { setEditingEntry(entry); setModalType(entry.type); setIsModalOpen(true); };
    const handleDeleteEntry = (entry) => { if (!entry.isRecurring) { if (window.confirm(`Are you sure you want to delete "${entry.description}"?`)) { handleDeleteAll(entry.id); } } else { setItemToDelete(entry); setIsDeleteModalOpen(true); } };
    
    const handleExportPDF = () => {
        if (displayedEntries.length === 0) {
            alert("No data to export to PDF.");
            return;
        }
        const title = `Budget Report - ${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
        generatePdf(title, displayedEntries, totalIncome, totalExpenses, balance, accountMap);
    };

    const handleSaveImportedTransactions = async (transactionsToSave) => {
        if (!db || !userId) {
            setError("Not authenticated. Cannot save transactions.");
            return;
        }
        if (transactionsToSave.length === 0) {
            setMessage("No transactions were selected to import.");
            setCurrentView('dashboard');
            return;
        }
    
        const batch = writeBatch(db);
    
        transactionsToSave.forEach(transaction => {
            const newDocRef = doc(collection(db, `artifacts/${appId}/users/${userId}/budgetEntries`));
            
            // The date from an <input type="date"> is a string 'YYYY-MM-DD'.
            // new Date('YYYY-MM-DD') creates a date at UTC midnight. To avoid timezone shifts
            // that could change the date, we can split and construct the date.
            const dateParts = transaction.date.split('-');
            const year = parseInt(dateParts[0], 10);
            const month = parseInt(dateParts[1], 10) - 1; // JS months are 0-indexed
            const day = parseInt(dateParts[2], 10);
            const transactionDate = new Date(year, month, day);

            const newEntry = {
                description: transaction.description,
                amount: Number(transaction.amount),
                type: transaction.type,
                accountId: transaction.accountId,
                category: transaction.category,
                isRecurring: transaction.isRecurring,
                recurrenceFrequency: transaction.recurrenceFrequency,
                timestamp: Timestamp.fromDate(transactionDate),
                paidDates: [],
                skippedDates: [],
            };
            batch.set(newDocRef, newEntry);
        });
    
        try {
            await batch.commit();
            setMessage(`${transactionsToSave.length} transaction(s) have been imported successfully!`);
            setCurrentView('dashboard');
        } catch (e) {
            console.error("Error importing transactions: ", e);
            setError("An error occurred while importing transactions.");
        }
    };

    // --- Render Logic ---
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    if (!userId) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-900">
                <TailwindStyles />
                <div className="w-full max-w-sm bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-6 sm:p-8">
                    <h1 className="text-3xl font-bold text-center text-gray-200 mb-2">Welcome!</h1>
                    <p className="text-center text-gray-400 mb-6">Sign in with a magic link.</p>
                    {message && !error && <div className="bg-blue-600 bg-opacity-25 text-blue-300 p-3 rounded-lg mb-4 text-center text-sm">{message}</div>}
                    <form onSubmit={handleSendMagicLink}>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full p-3 border border-gray-600 rounded-lg mb-4 bg-gray-700 text-gray-200 focus:ring-2 focus:ring-blue-500" required />
                        <button type="submit" disabled={authLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:bg-gray-600">
                            {authLoading ? 'Sending...' : 'Send Magic Link'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }
    
    return ( 
        <div className="min-h-screen flex flex-col md:flex-row bg-gray-900 text-gray-200">
            <TailwindStyles />
            <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
            <main className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar">
                <div className="w-full max-w-7xl mx-auto">
                    {currentView === 'dashboard' && (
                        <DashboardView 
                            userEmail={userEmail}
                            onSettingsClick={() => setIsSettingsModalOpen(true)}
                            onLogout={handleLogout}
                            authLoading={authLoading}
                            selectedDate={selectedDate}
                            months={months}
                            handlePreviousMonth={handlePreviousMonth}
                            handleNextMonth={handleNextMonth}
                            handlePreviousYear={handlePreviousYear}
                            handleNextYear={handleNextYear}
                            totalIncome={totalIncome}
                            totalExpenses={totalExpenses}
                            balance={balance}
                            formatCurrency={formatCurrency}
                            onAddIncome={() => { setModalType('income'); setEditingEntry(null); setIsModalOpen(true); }}
                            onAddExpense={() => { setModalType('expense'); setEditingEntry(null); setIsModalOpen(true); }}
                            onExportCSV={handleExportCSV}
                            onExportPDF={handleExportPDF}
                            payPeriodSettings={payPeriodSettings}
                            currentPayPeriod={currentPayPeriod}
                            handlePreviousPayPeriod={handlePreviousPayPeriod}
                            handleNextPayPeriod={handleNextPayPeriod}
                            upcomingBills={upcomingBills}
                            handleOpenPayModal={handleOpenPayModal}
                            totalUpcomingBills={totalUpcomingBills}
                            paidBillsThisPayPeriod={paidBillsThisPayPeriod}
                            handleUnpayBill={handleUnpayBill}
                            totalPaidBills={totalPaidBills}
                            incomeEntries={incomeEntries}
                            expenseEntries={expenseEntries}
                            handleEditEntry={handleEditEntry}
                            handleDeleteEntry={handleDeleteEntry}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            accountMap={accountMap}
                        />
                    )}
                    {currentView === 'accounts' && <AccountsView accountsWithBalances={accountsWithBalances} netWorth={netWorth} onAddAccount={() => setIsAccountModalOpen(true)} formatCurrency={formatCurrency} />}
                    {currentView === 'yearly-summary' && <YearlySummaryView entries={entries} formatCurrency={formatCurrency} />}
                    {currentView === 'import' && (
                        <ImportView 
                            accounts={accounts}
                            onSaveTransactions={handleSaveImportedTransactions}
                        />
                    )}
                </div>
            </main>

            {isModalOpen && <AddEntryModal onClose={() => { setIsModalOpen(false); setEditingEntry(null); }} onAddEntry={handleAddEntry} onUpdateEntry={handleUpdateEntry} initialType={modalType} entryToEdit={editingEntry} accounts={accounts} />}
            {isAccountModalOpen && <AddAccountModal onClose={() => setIsAccountModalOpen(false)} onSave={handleAddAccount} />}
            {isPayBillModalOpen && <PayBillModal onClose={() => setIsPayBillModalOpen(false)} onSave={handleConfirmPayment} onSkip={handleSkipPayment} bill={billToPay} />}
            {isSettingsModalOpen && <SettingsModal onClose={() => setIsSettingsModalOpen(false)} onSave={handleSaveSettings} currentSettings={payPeriodSettings} />}
            {isDeleteModalOpen && <DeleteConfirmationModal item={itemToDelete} onClose={() => setIsDeleteModalOpen(false)} onConfirmDeleteAll={() => handleDeleteAll(itemToDelete.id)} onConfirmDeleteFuture={() => handleDeleteFuture(itemToDelete)} />}

            {(message && !error) && <div className="toast-notification bg-green-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg">{message}</div>}
            {error && <div className="toast-notification bg-red-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg">{error}</div>}
        </div> 
    );
};

export default App;