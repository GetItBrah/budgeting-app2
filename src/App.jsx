import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, collection, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAvBS8ejKNaAd8ssjE7jAriGhRtI7NkZcU",
    authDomain: "budget-56f02.firebaseapp.com",
    projectId: "budget-56f02",
    storageBucket: "budget-56f02.firebasestorage.app",
    messagingSenderId: "634607383248",
    appId: "1:634607383248:web:7e6ac885c26b1271d264d5",
    measurementId: "G-QWG3Z4XQZB"
};

const appId = firebaseConfig.appId;

// This component contains all the raw CSS needed for your app.
const TailwindStyles = () => (
    <style>{`
    /* Tailwind CSS Base & Preflight */
    *, ::before, ::after { box-sizing: border-box; border-width: 0; border-style: solid; border-color: #e5e7eb; }
    html { line-height: 1.5; -webkit-text-size-adjust: 100%; -moz-tab-size: 4; tab-size: 4; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; }
    body { margin: 0; line-height: inherit; }
    h1, h2, p, button, input, select, label, ul, li { margin: 0; padding: 0; }
    button, [type='button'], [type='reset'], [type='submit'] { -webkit-appearance: button; background-color: transparent; background-image: none; }
    
    /* Modal Styles */
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 50; }
    .modal-content { position: relative; background-color: white; padding: 1.5rem; border-radius: 1rem; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); width: 100%; max-width: 28rem; }
    .modal-close-btn { position: absolute; top: 0.5rem; right: 0.5rem; color: #9ca3af; }
    .modal-close-btn:hover { color: #1f2937; }

    /* Your App's Generated CSS */
    .min-h-screen { min-height: 100vh; } .flex { display: flex; } .items-center { align-items: center; } .justify-center { justify-content: center; } .justify-between { justify-content: space-between; } .p-4 { padding: 1rem; } .p-6 { padding: 1.5rem; } .p-3 { padding: 0.75rem; } .p-2 { padding: 0.5rem; } .px-4 { padding-left: 1rem; padding-right: 1rem; } .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; } .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; } .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; } .pr-2 { padding-right: 0.5rem; } .py-8 { padding-top: 2rem; padding-bottom: 2rem; } .w-10 { width: 2.5rem; } .h-10 { height: 2.5rem; } .w-6 { width: 1.5rem; } .h-6 { height: 1.5rem; } .w-full { width: 100%; } .flex-1 { flex: 1 1 0%; } .flex-col { flex-direction: column; } .animate-spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .text-blue-500 { color: #3b82f6; } .text-gray-700 { color: #374151; } .text-white { color: #ffffff; } .text-gray-800 { color: #1f2937; } .text-gray-500 { color: #6b7280; } .text-blue-800 { color: #1e40af; } .text-red-800 { color: #991b1b; } .text-green-500 { color: #22c55e; } .text-red-500 { color: #ef4444; } .text-green-700 { color: #15803d; } .text-red-700 { color: #b91c1c; } .text-green-600 { color: #16a34a; } .hover\\:bg-green-700:hover { background-color: #15803d; } .text-red-600 { color: #dc2626; } .hover\\:bg-red-700:hover { background-color: #b91c1c; } .text-gray-400 { color: #9ca3af; } .mx-auto { margin-left: auto; margin-right: auto; } .mt-4 { margin-top: 1rem; } .mr-2 { margin-right: 0.5rem; } .ml-2 { margin-left: 0.5rem; } .mb-2 { margin-bottom: 0.5rem; } .mb-6 { margin-bottom: 1.5rem; } .mb-4 { margin-bottom: 1rem; } .mt-8 { margin-top: 2rem; } .max-w-sm { max-width: 24rem; } .max-w-2xl { max-width: 42rem; } .max-w-4xl { max-width: 56rem; } .bg-white { background-color: #ffffff; } .bg-gray-100 { background-color: #f3f4f6; } .bg-gray-200 { background-color: #e5e7eb; } .bg-gray-50 { background-color: #f9fafb; } .bg-gray-700 { background-color: #374151; } .hover\\:bg-gray-600:hover { background-color: #4b5563; } .bg-blue-100 { background-color: #dbeafe; } .bg-red-100 { background-color: #fee2e2; } .bg-blue-500 { background-color: #3b82f6; } .hover\\:bg-blue-600:hover { background-color: #2563eb; } .bg-red-500 { background-color: #ef4444; } .bg-red-600 { background-color: #dc2626; } .hover\\:bg-red-600:hover { background-color: #dc2626; } .bg-green-500 { background-color: #22c55e; } .bg-green-600 { background-color: #16a34a; } .bg-green-100 { background-color: #dcfce7; } .rounded-2xl { border-radius: 1rem; } .rounded-xl { border-radius: 0.75rem; } .rounded-full { border-radius: 9999px; } .rounded-lg { border-radius: 0.5rem; } .rounded { border-radius: 0.25rem; } .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); } .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05); } .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05); } .overflow-hidden { overflow: hidden; } .text-center { text-align: center; } .font-bold { font-weight: 700; } .font-sans { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; } .font-semibold { font-weight: 600; } .font-extrabold { font-weight: 800; } .font-medium { font-weight: 500; } .text-3xl { font-size: 1.875rem; line-height: 2.25rem; } .text-4xl { font-size: 2.25rem; line-height: 2.5rem; } .text-2xl { font-size: 1.5rem; line-height: 2rem; } .text-xl { font-size: 1.25rem; line-height: 1.75rem; } .text-lg { font-size: 1.125rem; line-height: 1.75rem; } .text-sm { font-size: 0.875rem; line-height: 1.25rem; } .text-xs { font-size: 0.75rem; line-height: 1rem; } .gap-4 { gap: 1rem; } .gap-6 { gap: 1.5rem; } .space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 1rem; } .space-x-4 > :not([hidden]) ~ :not([hidden]) { margin-left: 1rem; } .border { border-width: 1px; } .border-gray-300 { border-color: #d1d5db; } .border-gray-200 { border-color: #e5e7eb; } .focus\\:outline-none:focus { outline: 2px solid transparent; outline-offset: 2px; } .focus\\:ring-2:focus { --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color); --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color); box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000); } .focus\\:ring-blue-500:focus { --tw-ring-color: #3b82f6; } .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; } .transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; } .duration-300 { transition-duration: 300ms; } .duration-200 { transition-duration: 200ms; } .transform { transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)); } .hover\\:scale-105:hover { --tw-scale-x: 1.05; --tw-scale-y: 1.05; transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)); } .hover\\:scale-\\[1\\.01\\]:hover { --tw-scale-x: 1.01; --tw-scale-y: 1.01; transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)); } .disabled\\:bg-gray-400:disabled { background-color: #9ca3af; } .disabled\\:transform-none:disabled { transform: none; } .hover\\:underline:hover { text-decoration-line: underline; } .break-all { word-break: break-all; } .max-h-80 { max-height: 20rem; } .overflow-y-auto { overflow-y: auto; } .custom-scrollbar::-webkit-scrollbar { width: 8px; } .custom-scrollbar::-webkit-scrollbar-track { background: #e5e7eb; border-radius: 10px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #9ca3af; border-radius: 10px; } .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6b7280; } .opacity-25 { opacity: 0.25; } .opacity-75 { opacity: 0.75; } .hover\\:text-red-700:hover { color: #b91c1c; }
    @media (min-width: 640px) { .sm\\:grid { display: grid; } .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); } .sm\\:p-8 { padding: 2rem; } .sm\\:p-6 { padding: 1.5rem; } .sm\\:text-4xl { font-size: 2.25rem; line-height: 2.5rem; } .sm\\:text-2xl { font-size: 1.5rem; line-height: 2rem; } .sm\\:flex-row { flex-direction: row; } .sm\\:w-auto { width: auto; } }
    @media (min-width: 768px) { .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
    @media (min-width: 1024px) { .lg\\:p-8 { padding: 2rem; } }
    `}</style>
);

const App = () => {
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('expense');

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    useEffect(() => {
        if (!firebaseConfig || !firebaseConfig.projectId) {
            setError("Firebase config is invalid."); setLoading(false); return;
        }
        try {
            const app = initializeApp(firebaseConfig);
            const firestore = getFirestore(app);
            const firebaseAuth = getAuth(app);
            setDb(firestore);
            setAuth(firebaseAuth);
            const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
                if (user) {
                    setUserId(user.uid);
                    setUserEmail(user.email);
                } else {
                    setUserId(null);
                    setUserEmail(null);
                }
                setLoading(false);
            });
            return () => unsubscribe();
        } catch (e) {
            console.error("Failed to initialize Firebase:", e);
            setError("Failed to initialize the app."); setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!db || !userId) {
            setEntries([]); return;
        }
        const collectionPath = `artifacts/${appId}/users/${userId}/budgetEntries`;
        const q = collection(db, collectionPath);
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const entriesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            entriesList.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
            setEntries(entriesList);
        }, (err) => {
            console.error("Error fetching data:", err);
            setError("Could not retrieve budget data.");
        });
        return () => unsubscribe();
    }, [db, userId]);
    
    // --- NEW: Handlers for arrow navigation ---
    const handlePreviousMonth = () => {
        setSelectedDate(currentDate => {
            const newDate = new Date(currentDate);
            newDate.setMonth(newDate.getMonth() - 1);
            return newDate;
        });
    };

    const handleNextMonth = () => {
        setSelectedDate(currentDate => {
            const newDate = new Date(currentDate);
            newDate.setMonth(newDate.getMonth() + 1);
            return newDate;
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault(); setAuthLoading(true); setMessage(null); setError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (e) {
            setError("Failed to log in. Please check your email and password.");
        } finally {
            setAuthLoading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault(); setAuthLoading(true); setMessage(null); setError(null);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (e) {
            setError("Failed to create account. Please try again.");
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLogout = async () => {
        setAuthLoading(true);
        try {
            await signOut(auth);
        } catch (e) {
            setError("Failed to log out.");
        } finally {
            setAuthLoading(false);
        }
    };

    const displayedEntries = useMemo(() => {
        const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
        const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
        const oneTimeForMonth = entries.filter(entry => !entry.isRecurring && entry.timestamp?.toDate).map(entry => ({ ...entry, timestamp: entry.timestamp.toDate() })).filter(entry => entry.timestamp >= startOfMonth && entry.timestamp <= endOfMonth);
        const recurringForMonth = [];
        entries.filter(e => e.isRecurring).forEach(recurringItem => {
            if (!recurringItem.timestamp?.toDate) return;
            let currentDate = recurringItem.timestamp.toDate();
            const cancellationDate = recurringItem.cancellationDate?.toDate ? recurringItem.cancellationDate.toDate() : null;
            while (currentDate <= endOfMonth) {
                if (cancellationDate && currentDate > cancellationDate) break;
                if (currentDate >= startOfMonth) {
                    recurringForMonth.push({ ...recurringItem, displayId: recurringItem.id + '-' + currentDate.getTime(), timestamp: new Date(currentDate) });
                }
                switch (recurringItem.recurrenceFrequency) {
                    case 'weekly': currentDate = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000); break;
                    case 'bi-weekly': currentDate = new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000); break;
                    case 'every-4-weeks': currentDate = new Date(currentDate.getTime() + 28 * 24 * 60 * 60 * 1000); break;
                    case 'monthly': currentDate.setMonth(currentDate.getMonth() + 1); break;
                    case 'quarterly': currentDate.setMonth(currentDate.getMonth() + 3); break;
                    case 'annually': currentDate.setFullYear(currentDate.getFullYear() + 1); break;
                    default: currentDate.setFullYear(currentDate.getFullYear() + 100); break;
                }
            }
        });
        return [...oneTimeForMonth, ...recurringForMonth].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }, [selectedDate, entries]);
    
    const { totalIncome, totalExpenses, balance } = useMemo(() => {
        const totals = displayedEntries.reduce((acc, entry) => {
            if (entry.type === 'income') {
                acc.income += entry.amount;
            } else {
                acc.expenses += entry.amount;
            }
            return acc;
        }, { income: 0, expenses: 0 });
        return { totalIncome: totals.income, totalExpenses: totals.expenses, balance: totals.income - totals.expenses };
    }, [displayedEntries]);

    const incomeEntries = useMemo(() => displayedEntries.filter(e => e.type === 'income'), [displayedEntries]);
    const expenseEntries = useMemo(() => displayedEntries.filter(e => e.type === 'expense'), [displayedEntries]);


    const handleAddEntry = async (entryData) => {
        if (!db || !userId) {
            setMessage("User not authenticated."); return false;
        }
        setAuthLoading(true); setMessage(null);
        try {
            const collectionPath = `artifacts/${appId}/users/${userId}/budgetEntries`;
            await addDoc(collection(db, collectionPath), entryData);
            setMessage("Entry added successfully!");
            return true;
        } catch (e) {
            console.error("Error adding document: ", e);
            setMessage("Failed to add entry.");
            return false;
        } finally {
            setAuthLoading(false);
        }
    };

    const handleDeleteEntry = async (id, isRecurringEntry) => {
        if (!db || !userId) return;
        try {
            const docRef = doc(db, `artifacts/${appId}/users/${userId}/budgetEntries/${id}`);
            if (isRecurringEntry) {
                await updateDoc(docRef, { cancellationDate: new Date() });
            } else {
                await deleteDoc(docRef);
            }
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
    };
    
    const handleExportCSV = () => {
        const headers = ['Type', 'Description', 'Amount', 'Date', 'Recurring', 'Frequency'];
        const rows = displayedEntries.map(entry => [
            entry.type, `"${entry.description.replace(/"/g, '""')}"`, entry.amount, entry.timestamp.toLocaleDateString(),
            entry.isRecurring ? 'Yes' : 'No', entry.isRecurring ? entry.recurrenceFrequency : '',
        ]);
        let csvContent = headers.join(',') + '\n' + rows.map(e => e.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url); link.setAttribute('download', 'budget-tracker.csv');
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    };

    if (loading) { return ( <div className="min-h-screen flex items-center justify-center bg-gray-100"><p>Loading...</p></div> ); }
    if (error && !userId) { return ( <div className="min-h-screen flex items-center justify-center bg-gray-100"><p className="text-red-500">{error}</p></div> ); }

    const renderLogin = () => (
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-center mb-2">{isLoginView ? 'Log In' : 'Sign Up'}</h1>
            <p className="text-center text-gray-500 mb-6">to access your budget.</p>
            {error && <div className="bg-red-100 text-red-800 rounded-xl p-3 text-center mb-4">{error}</div>}
            <form onSubmit={isLoginView ? handleLogin : handleSignup} className="flex flex-col gap-4">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="p-3 rounded-xl border focus:ring-2 focus:ring-blue-500" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="p-3 rounded-xl border focus:ring-2 focus:ring-blue-500" />
                <button type="submit" disabled={authLoading} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl disabled:bg-gray-400">
                    {authLoading ? 'Loading...' : (isLoginView ? 'Log In' : 'Sign Up')}
                </button>
            </form>
            <button onClick={() => setIsLoginView(!isLoginView)} className="w-full mt-4 text-sm text-blue-500 hover:underline">
                {isLoginView ? 'Need an account? Sign Up' : 'Already have an account? Log In'}
            </button>
        </div>
    );

    const renderEntryListItem = (entry) => (
        <li key={entry.displayId || entry.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl shadow-sm">
            <div>
                <p className="font-medium">{entry.description}{entry.isRecurring && <span className="text-xs ml-2 text-gray-400">(R)</span>}</p>
                <p className="text-sm text-gray-500">{entry.timestamp?.toLocaleDateString()}</p>
            </div>
            <div className="flex items-center space-x-2">
                <span className={`font-semibold ${entry.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(entry.amount)}</span>
                <button onClick={() => handleDeleteEntry(entry.id, entry.isRecurring)} className="text-red-500 hover:text-red-700" aria-label="Delete">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
        </li>
    );

    const renderApp = () => (
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-gray-800">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-3xl font-bold">Monthly Budget</h1>
                    <p className="text-sm text-gray-500">Signed in as: {userEmail || 'N/A'}</p>
                </div>
                <button onClick={handleLogout} disabled={authLoading} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm">Sign Out</button>
            </div>
            
            {/* --- UPDATED: Replaced dropdowns with arrow navigation --- */}
            <div className="flex items-center justify-center gap-4 mb-6">
                <button onClick={handlePreviousMonth} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Previous month">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <h2 className="text-xl font-semibold text-center w-48">
                    {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                </h2>
                <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Next month">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>

            <div className="grid gap-4 sm:gap-6 mb-6 sm:grid-cols-1 md:grid-cols-3">
                <div className="bg-gray-100 p-4 rounded-xl text-center shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-600">Income</h3>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-xl text-center shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-600">Expenses</h3>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-xl text-center shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-600">Balance</h3>
                    <p className={`text-2xl font-bold ${balance >= 0 ? 'text-gray-800' : 'text-red-600'}`}>{formatCurrency(balance)}</p>
                </div>
            </div>

            <div className="flex justify-center gap-4 mb-8">
                <button onClick={() => { setModalType('income'); setIsModalOpen(true); }} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">Add Income</button>
                <button onClick={() => { setModalType('expense'); setIsModalOpen(true); }} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">Add Expense</button>
                <button onClick={handleExportCSV} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">Download CSV</button>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2">
                <div>
                    <h2 className="text-xl font-bold mb-4">Income</h2>
                    <ul className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                        {incomeEntries.length > 0 ? incomeEntries.map(renderEntryListItem) : <li className="text-center text-gray-500">No income this month.</li>}
                    </ul>
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-4">Expenses</h2>
                    <ul className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                        {expenseEntries.length > 0 ? expenseEntries.map(renderEntryListItem) : <li className="text-center text-gray-500">No expenses this month.</li>}
                    </ul>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
            <TailwindStyles />
            {isModalOpen && <AddEntryModal onClose={() => setIsModalOpen(false)} onAddEntry={handleAddEntry} initialType={modalType} authLoading={authLoading} />}
            {userId ? renderApp() : renderLogin()}
        </div>
    );
};

const AddEntryModal = ({ onClose, onAddEntry, initialType, authLoading }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState(initialType);
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurrenceFrequency, setRecurrenceFrequency] = useState('monthly');
    const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);
    const [localMessage, setLocalMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description || transactionDate === '' || amount === '' || isNaN(parseFloat(amount))) {
            setLocalMessage("Please fill out all fields."); return;
        }
        const success = await onAddEntry({
            description, amount: parseFloat(amount), type, isRecurring,
            recurrenceFrequency: isRecurring ? recurrenceFrequency : null,
            timestamp: new Date(transactionDate.replace(/-/g, '/')),
        });
        if (success) { onClose(); } 
        else { setLocalMessage("Failed to add entry. Please try again."); }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <h2 className="text-2xl font-bold text-center mb-4">Add New Transaction</h2>
                {localMessage && <p className="bg-red-100 text-red-800 rounded-xl p-3 text-center mb-4">{localMessage}</p>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex justify-center gap-4">
                        <button type="button" onClick={() => setType('income')} className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium ${type === 'income' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700'}`}>Income</button>
                        <button type="button" onClick={() => setType('expense')} className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium ${type === 'expense' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700'}`}>Expense</button>
                    </div>
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500" />
                    <div className="flex gap-4">
                        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" min="0" step="0.01" className="flex-1 p-3 rounded-xl border focus:ring-2 focus:ring-blue-500" />
                        <input type="date" value={transactionDate} onChange={(e) => setTransactionDate(e.target.value)} className="p-3 rounded-xl border focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="flex items-center justify-between">
                        <label className="text-gray-700 flex items-center">
                            <input type="checkbox" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} className="mr-2" /> Recurring
                        </label>
                        {isRecurring && (
                            <select value={recurrenceFrequency} onChange={(e) => setRecurrenceFrequency(e.target.value)} className="p-2 rounded-xl border focus:ring-2 focus:ring-blue-500">
                                <option value="weekly">Weekly</option> <option value="bi-weekly">Bi-weekly</option> <option value="every-4-weeks">Every 4 weeks</option>
                                <option value="monthly">Monthly</option> <option value="quarterly">Quarterly</option> <option value="annually">Annually</option>
                            </select>
                        )}
                    </div>
                    <button type="submit" disabled={authLoading} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl disabled:bg-gray-400">
                        {authLoading ? 'Adding...' : 'Add Entry'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default App;
