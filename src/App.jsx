import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, signInWithCustomToken, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, collection, addDoc, updateDoc, deleteDoc, serverTimestamp, setLogLevel } from 'firebase/firestore';

// NOTE: Your web app's Firebase configuration is now expected to be provided by the environment.
// This is a security best practice to avoid exposing sensitive keys in the source code.
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';


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

            <main className="bg-gray-800 p-6 rounded-2xl">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-black p-4 rounded-xl">
                        <h2 className="text-sm text-gray-400">Income</h2>
                        <p className="text-2xl font-bold text-green-400">{formatCurrency(totalIncome)}</p>
                    </div>
                    <div className="bg-black p-4 rounded-xl">
                        <h2 className="text-sm text-gray-400">Expenses</h2>
                        <p className="text-2xl font-bold text-red-400">{formatCurrency(totalExpenses)}</p>
                    </div>
                     <div className="bg-black p-4 rounded-xl">
                        <h2 className="text-sm text-gray-400">Balance</h2>
                        <p className={`text-2xl font-bold ${balance >= 0 ? 'text-white' : 'text-red-400'}`}>{formatCurrency(balance)}</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8">
                     <button onClick={() => openModal('income')} className="flex-1 bg-green-500 hover:bg-green-600 font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg">Add Income</button>
                     <button onClick={() => openModal('expense')} className="flex-1 bg-red-500 hover:bg-red-600 font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg">Add Expense</button>
                </div>
                
                {/* Transaction Lists */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-xl font-bold mb-4">Income</h2>
                        <div className="space-y-3">
                            {incomeEntries.length > 0 ? incomeEntries.map(entry => (
                                <TransactionItem key={entry.id} entry={entry} onDelete={handleDeleteEntry} />
                            )) : <p className="text-gray-500">No income this month.</p>}
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold mb-4">Expenses</h2>
                        <div className="space-y-3">
                            {expenseEntries.length > 0 ? expenseEntries.map(entry => (
                               <TransactionItem key={entry.id} entry={entry} onDelete={handleDeleteEntry} />
                            )) : <p className="text-gray-500">No expenses this month.</p>}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
    
    // Main render
    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans flex items-center justify-center">
            <script src="https://cdn.tailwindcss.com"></script>
            {userId ? renderApp() : renderLogin()}
        </div>
    );
};

const TransactionItem = ({ entry, onDelete }) => (
    <div className="bg-black p-3 rounded-lg flex justify-between items-center">
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

