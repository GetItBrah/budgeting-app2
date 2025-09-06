import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, signInWithCustomToken, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, collection, addDoc, updateDoc, deleteDoc, serverTimestamp, setLogLevel } from 'firebase/firestore';

// NOTE: Your web app's Firebase configuration is now expected to be provided by the environment.
// This is a security best practice to avoid exposing sensitive keys in the source code.
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// This component contains all the raw CSS needed for your app.
const TailwindStyles = () => (
    <style>{`
    *,:after,:before{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}body{margin:0;line-height:inherit}h1,h2,p,button,input,select,label,ul,li{margin:0;padding:0}button,[type=button],[type=reset],[type=submit]{-webkit-appearance:button;background-color:transparent;background-image:none}.bg-black{background-color:#000}.bg-gray-700{background-color:#374151}.bg-gray-800{background-color:#1f2937}.bg-gray-900{background-color:#111827}.bg-green-500{background-color:#22c55e}.bg-opacity-20{background-color:rgba(59,130,246,.2)}.bg-opacity-75{background-color:rgba(0,0,0,.75)}.bg-red-500{background-color:#ef4444}.hover\\:bg-gray-700:hover{background-color:#374151}.hover\\:bg-green-600:hover{background-color:#16a34a}.hover\\:bg-red-600:hover{background-color:#dc2626}.rounded-2xl{border-radius:1rem}.rounded-lg{border-radius:.5rem}.rounded-md{border-radius:.375rem}.border{border-width:1px}.border-gray-600{border-color:#4b5563}.p-2{padding:.5rem}.p-3{padding:.75rem}.p-4{padding:1rem}.p-5{padding:1.25rem}.p-6{padding:1.5rem}.p-8{padding:2rem}.px-6{padding-left:1.5rem;padding-right:1.5rem}.py-3{padding-top:.75rem;padding-bottom:.75rem}.py-4{padding-top:1rem;padding-bottom:1rem}.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.inset-0{top:0;right:0;bottom:0;left:0}.top-4{top:1rem}.right-4{right:1rem}.z-50{z-index:50}.mb-1{margin-bottom:.25rem}.mb-2{margin-bottom:.5rem}.mb-4{margin-bottom:1rem}.mb-6{margin-bottom:1.5rem}.mb-8{margin-bottom:2rem}.ml-4{margin-left:1rem}.mt-2{margin-top:.5rem}.mt-4{margin-top:1rem}.block{display:block}.flex{display:flex}.grid{display:grid}.h-10{height:2.5rem}.h-5{height:1.25rem}.h-6{height:1.5rem}.min-h-screen{min-height:100vh}.w-10{width:2.5rem}.w-20{width:5rem}.w-28{width:7rem}.w-5{width:1.25rem}.w-6{width:1.5rem}.w-full{width:100%}.max-w-4xl{max-width:56rem}.max-w-md{max-width:28rem}.max-w-sm{max-width:24rem}.flex-1{flex:1 1 0%}.transform{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.animate-spin{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.flex-col{flex-direction:column}.items-center{align-items:center}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-1{gap:.25rem}.gap-2{gap:.5rem}.gap-4{gap:1rem}.gap-6{gap:1.5rem}.gap-8{gap:2rem}.space-y-3>:not([hidden])~:not([hidden]){margin-top:.75rem}.font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.text-2xl{font-size:1.5rem;line-height:2rem}.text-3xl{font-size:1.875rem;line-height:2.25rem}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-xs{font-size:.75rem;line-height:1rem}.font-bold{font-weight:700}.font-medium{font-weight:500}.font-semibold{font-weight:600}.text-blue-300{color:#93c5fd}.text-center{text-align:center}.text-gray-300{color:#d1d5db}.text-gray-400{color:#9ca3af}.text-gray-500{color:#6b7280}.text-green-400{color:#4ade80}.text-red-300{color:#fca5a5}.text-red-400{color:#f87171}.text-white{color:#fff}.hover\\:text-red-400:hover{color:#f87171}.hover\\:text-white:hover{color:#fff}.shadow-lg{box-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -2px rgba(0,0,0,.05)}.shadow-xl{box-shadow:0 20px 25px -5px rgba(0,0,0,.1),0 10px 10px -5px rgba(0,0,0,.04)}.transition-all{transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.duration-300{transition-duration:.3s}.hover\\:scale-105:hover{--tw-scale-x:1.05;--tw-scale-y:1.05;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.hover\\:underline:hover{text-decoration-line:underline}.disabled\\:bg-gray-500:disabled{background-color:#6b7280}.disabled\\:transform-none:disabled{transform:none}.focus\\:outline-none:focus{outline:2px solid transparent;outline-offset:2px}.focus\\:ring-2:focus{--tw-ring-offset-shadow:var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow:var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow,0 0 #0000)}.focus\\:ring-green-400:focus{--tw-ring-color:#4ade80}.opacity-25{opacity:.25}.opacity-75{opacity:.75}@media (min-width:640px){.sm\\:flex-row{flex-direction:row}.sm\\:p-6{padding:1.5rem}.sm\\:mt-0{margin-top:0}.sm\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}}@media (min-width:1024px){.lg\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}}
    `}</style>
  );

const App = () => {
    // Firebase State
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    // App State
    const [entries, setEntries] =useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('income');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);
    
    // Auth Form State
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    
    // Date Navigation
    const months = useMemo(() => ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], []);

    // --- Firebase Initialization and Auth ---
    useEffect(() => {
        try {
            const app = initializeApp(firebaseConfig);
            const firestore = getFirestore(app);
            const firebaseAuth = getAuth(app);
            setDb(firestore);
            setAuth(firebaseAuth);
            setLogLevel('debug');

            const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
                if (user) {
                    setUserId(user.uid);
                    setUserEmail(user.email);
                } else {
                    // Automatically sign in the user if a token is provided, otherwise sign in anonymously.
                     try {
                        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                            await signInWithCustomToken(firebaseAuth, __initial_auth_token);
                        } else {
                            await signInAnonymously(firebaseAuth);
                        }
                    } catch (authError) {
                        console.error("Automatic sign-in failed:", authError);
                        setError("Could not authenticate user.");
                    }
                    setUserEmail(null);
                }
                setIsAuthReady(true);
                setLoading(false);
            });
            return () => unsubscribe();
        } catch (e) {
            console.error("Failed to initialize Firebase:", e);
            setError("App configuration error. Please check console.");
            setLoading(false);
        }
    }, []);

    // --- Data Fetching ---
    useEffect(() => {
        if (!isAuthReady || !db || !userId) {
            setEntries([]);
            return;
        }
        const collectionPath = `artifacts/${appId}/users/${userId}/budgetEntries`;
        const q = collection(db, collectionPath);
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const entriesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEntries(entriesList);
        }, (err) => {
            console.error("Error fetching data:", err);
            setError("Could not retrieve budget data.");
        });
        return () => unsubscribe();
    }, [db, userId, isAuthReady]);

    // --- Authentication Handlers ---
    const handleAuthAction = async (e, action) => {
        e.preventDefault();
        setAuthLoading(true);
        setMessage(null);
        setError(null);
        try {
            if (action === 'login') {
                await signInWithEmailAndPassword(auth, email, password);
                setMessage("Logged in successfully!");
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
                setMessage("Account created! You are now logged in.");
            }
        } catch (err) {
            console.error(`${action} error:`, err);
            setError(`Failed to ${action}. Please check your credentials.`);
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLogout = async () => {
        if (!auth) return;
        try {
            await signOut(auth);
            setUserId(null); // Clear user ID on logout
            setUserEmail(null); // Clear user email on logout
            setMessage("Logged out successfully.");
        } catch (e) {
            console.error("Logout error:", e);
            setError("Failed to log out.");
        }
    };
    
    // --- Data Filtering & Calculations ---
    const displayedEntries = useMemo(() => {
        return entries
            .filter(entry => {
                if (!entry.timestamp?.toDate) return false;
                const entryDate = entry.timestamp.toDate();
                return entryDate.getFullYear() === selectedDate.getFullYear() &&
                       entryDate.getMonth() === selectedDate.getMonth();
            })
            .map(entry => ({...entry, timestamp: entry.timestamp.toDate()}))
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }, [selectedDate, entries]);

    const incomeEntries = useMemo(() => displayedEntries.filter(e => e.type === 'income'), [displayedEntries]);
    const expenseEntries = useMemo(() => displayedEntries.filter(e => e.type === 'expense'), [displayedEntries]);
    
    const totalIncome = useMemo(() => incomeEntries.reduce((sum, entry) => sum + entry.amount, 0), [incomeEntries]);
    const totalExpenses = useMemo(() => expenseEntries.reduce((sum, entry) => sum + entry.amount, 0), [expenseEntries]);
    const balance = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);

    // --- Modal & Form Handlers ---
    const openModal = (type) => {
        setModalType(type);
        setDescription('');
        setAmount('');
        setTransactionDate(new Date().toISOString().split('T')[0]);
        setIsModalOpen(true);
    };

    const handleAddEntry = async (e) => {
        e.preventDefault();
        if (!description || transactionDate === '' || amount === '' || isNaN(parseFloat(amount))) {
            setError("Please fill out all fields with valid data.");
            return;
        }
        if (!db || !userId) {
            setError("Authentication error. Cannot add entry.");
            return;
        }
        
        const newEntry = {
            description,
            amount: parseFloat(amount),
            type: modalType,
            timestamp: new Date(transactionDate),
            createdAt: serverTimestamp(),
        };

        setAuthLoading(true);
        setError(null);

        try {
            const collectionPath = `artifacts/${appId}/users/${userId}/budgetEntries`;
            await addDoc(collection(db, collectionPath), newEntry);
            setMessage(`${modalType.charAt(0).toUpperCase() + modalType.slice(1)} added successfully!`);
            setIsModalOpen(false);
        } catch (err) {
            console.error("Error adding document: ", err);
            setError("Failed to add entry. Please try again.");
        } finally {
            setAuthLoading(false);
        }
    };
    
    const handleDeleteEntry = async (id) => {
         if (!db || !userId) {
            setError("Authentication error. Cannot delete entry.");
            return;
        }
        try {
            const docRef = doc(db, `artifacts/${appId}/users/${userId}/budgetEntries/${id}`);
            await deleteDoc(docRef);
            setMessage("Entry deleted successfully.");
        } catch (err) {
            console.error("Error deleting document:", err);
            setError("Failed to delete entry.");
        }
    };

    const handleExportCSV = () => {
        const headers = ['Type', 'Description', 'Amount', 'Date'];
        const rows = displayedEntries.map(entry => [
            entry.type,
            `"${entry.description.replace(/"/g, '""')}"`,
            entry.amount,
            entry.timestamp.toLocaleDateString(),
        ]);

        let csvContent = headers.join(',') + '\n' + rows.map(e => e.join(',')).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `budget-${selectedDate.getFullYear()}-${selectedDate.getMonth()+1}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    // --- Date Navigation ---
    const changeMonth = (delta) => {
        setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
    };

    const changeYear = (delta) => {
        setSelectedDate(prev => new Date(prev.getFullYear() + delta, prev.getMonth(), 1));
    };

    // --- Utility Functions ---
     const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    };

    // --- Render Functions ---
    if (loading) {
        return (
            <div className="bg-gray-900 min-h-screen flex items-center justify-center text-white">
                <TailwindStyles />
                <svg className="animate-spin h-10 w-10 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            </div>
        );
    }

    const renderModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 text-white relative">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <h2 className="text-2xl font-bold mb-6 text-center">Add New {modalType === 'income' ? 'Income' : 'Expense'}</h2>
                <form onSubmit={handleAddEntry} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-400 mb-1 block">Description</label>
                        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., Paycheck" className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-400 mb-1 block">Amount</label>
                        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" min="0" step="0.01" className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-gray-400 mb-1 block">Date</label>
                        <input type="date" value={transactionDate} onChange={(e) => setTransactionDate(e.target.value)} className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400" />
                    </div>
                    <button type="submit" disabled={authLoading} className={`w-full font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg mt-2 ${modalType === 'income' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} disabled:bg-gray-500`}>
                        {authLoading ? 'Saving...' : 'Save Transaction'}
                    </button>
                </form>
            </div>
        </div>
    );
    
    const renderLogin = () => (
         <div className="w-full max-w-sm bg-gray-800 rounded-2xl shadow-xl p-8 text-white">
             <h1 className="text-3xl font-bold text-center mb-2">{isLoginView ? 'Log In' : 'Sign Up'}</h1>
             <p className="text-center text-gray-400 mb-6">to manage your budget</p>
             {message && <div className="bg-blue-500 bg-opacity-20 text-blue-300 rounded-lg p-3 text-center mb-4">{message}</div>}
             {error && <div className="bg-red-500 bg-opacity-20 text-red-300 rounded-lg p-3 text-center mb-4">{error}</div>}
             <form onSubmit={(e) => handleAuthAction(e, isLoginView ? 'login' : 'signup')} className="flex flex-col gap-4">
                 <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400" />
                 <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400" />
                 <button type="submit" disabled={authLoading} className="w-full bg-green-500 hover:bg-green-600 font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:bg-gray-500 disabled:transform-none shadow-lg">
                     {authLoading ? 'Loading...' : (isLoginView ? 'Log In' : 'Sign Up')}
                 </button>
             </form>
             <button onClick={() => setIsLoginView(!isLoginView)} className="w-full mt-4 text-sm text-green-400 hover:underline">
                 {isLoginView ? 'Need an account? Sign Up' : 'Already have an account? Log In'}
             </button>
         </div>
    );

    const renderApp = () => (
        <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
            {isModalOpen && renderModal()}
            <header className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Monthly Budget</h1>
                    {userEmail && <p className="text-xs text-gray-400">Signed in as: {userEmail}</p>}
                </div>
                <div className="flex items-center gap-2 mt-4 sm:mt-0">
                    <div className="flex items-center gap-1">
                        <button onClick={() => changeYear(-1)} className="p-2 rounded-md hover:bg-gray-700">&lt;</button>
                        <span className="font-semibold text-lg w-20 text-center">{selectedDate.getFullYear()}</span>
                        <button onClick={() => changeYear(1)} className="p-2 rounded-md hover:bg-gray-700">&gt;</button>
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={() => changeMonth(-1)} className="p-2 rounded-md hover:bg-gray-700">&lt;</button>
                        <span className="font-semibold text-lg w-28 text-center">{months[selectedDate.getMonth()]}</span>
                        <button onClick={() => changeMonth(1)} className="p-2 rounded-md hover:bg-gray-700">&gt;</button>
                    </div>
                    <button onClick={handleLogout} className="ml-4 text-sm text-gray-400 hover:text-white">Sign Out</button>
                </div>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-800 p-5 rounded-2xl">
                    <h2 className="text-sm text-gray-400">Income</h2>
                    <p className="text-2xl font-bold text-green-400">{formatCurrency(totalIncome)}</p>
                </div>
                <div className="bg-gray-800 p-5 rounded-2xl">
                    <h2 className="text-sm text-gray-400">Expenses</h2>
                    <p className="text-2xl font-bold text-red-400">{formatCurrency(totalExpenses)}</p>
                </div>
                 <div className="bg-gray-800 p-5 rounded-2xl">
                    <h2 className="text-sm text-gray-400">Balance</h2>
                    <p className={`text-2xl font-bold ${balance >= 0 ? 'text-white' : 'text-red-400'}`}>{formatCurrency(balance)}</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mb-8">
                 <button onClick={() => openModal('income')} className="bg-green-500 hover:bg-green-600 font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg">Add Income</button>
                 <button onClick={() => openModal('expense')} className="bg-red-500 hover:bg-red-600 font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg">Add Expense</button>
                 <button onClick={handleExportCSV} className="text-gray-300 hover:text-white text-sm font-medium">Download CSV</button>
            </div>
            
            {/* Transaction Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-800 p-6 rounded-2xl">
                    <h2 className="text-xl font-bold mb-4">Income</h2>
                    <div className="space-y-3">
                        {incomeEntries.length > 0 ? incomeEntries.map(entry => (
                            <TransactionItem key={entry.id} entry={entry} onDelete={handleDeleteEntry} />
                        )) : <p className="text-gray-500 text-center py-4">No income this month.</p>}
                    </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-2xl">
                    <h2 className="text-xl font-bold mb-4">Expenses</h2>
                    <div className="space-y-3">
                        {expenseEntries.length > 0 ? expenseEntries.map(entry => (
                           <TransactionItem key={entry.id} entry={entry} onDelete={handleDeleteEntry} />
                        )) : <p className="text-gray-500 text-center py-4">No expenses this month.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
    
    // Main render
    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans flex items-center justify-center">
            <TailwindStyles />
            {userId ? renderApp() : renderLogin()}
        </div>
    );
};

const TransactionItem = ({ entry, onDelete }) => (
    <div className="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
        <div>
            <p className="font-medium">{entry.description}</p>
            <p className="text-xs text-gray-400">{entry.timestamp.toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-4">
            <p className={`font-bold ${entry.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>{formatCurrency(entry.amount)}</p>
            <button onClick={() => onDelete(entry.id)} className="text-gray-500 hover:text-red-400">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
        </div>
    </div>
);

export default App;

