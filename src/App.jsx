import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, signOut } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, collection, addDoc, updateDoc, deleteDoc, writeBatch, arrayUnion, arrayRemove, setDoc, Timestamp } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    // IMPORTANT: It's best practice to store these keys in environment variables
    // and not directly in the code for security reasons.
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
    .min-h-screen { min-height: 100vh; } .flex { display: flex; } .items-center { align-items: center; } .justify-center { justify-content: center; } .justify-between { justify-content: space-between; } .p-4 { padding: 1rem; } .p-6 { padding: 1.5rem; } .p-3 { padding: 0.75rem; } .p-2 { padding: 0.5rem; } .px-4 { padding-left: 1rem; padding-right: 1rem; } .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; } .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; } .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; } .pr-2 { padding-right: 0.5rem; } .py-8 { padding-top: 2rem; padding-bottom: 2rem; } .w-10 { width: 2.5rem; } .h-10 { height: 2.5rem; } .w-6 { width: 1.5rem; } .h-6 { height: 1.5rem; } .w-5 { width: 1.25rem; } .h-5 { height: 1.25rem; } .w-full { width: 100%; } .flex-1 { flex: 1 1 0%; } .flex-col { flex-direction: column; } .animate-spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .text-blue-500 { color: #3b82f6; } .text-gray-700 { color: #374151; } .text-white { color: #ffffff; } .text-gray-800 { color: #1f2937; } .text-gray-500 { color: #6b7280; } .hover\\:text-gray-700:hover { color: #374151; } .text-blue-800 { color: #1e40af; } .text-red-800 { color: #991b1b; } .text-green-500 { color: #22c55e; } .text-red-500 { color: #ef4444; } .text-green-700 { color: #15803d; } .text-red-700 { color: #b91c1c; } .text-green-600 { color: #16a34a; } .hover\\:bg-green-700:hover { background-color: #15803d; } .text-red-600 { color: #dc2626; } .hover\\:bg-red-700:hover { background-color: #b91c1c; } .text-gray-400 { color: #9ca3af; } .mx-auto { margin-left: auto; margin-right: auto; } .mt-4 { margin-top: 1rem; } .mr-2 { margin-right: 0.5rem; } .mr-3 { margin-right: 0.75rem; } .ml-2 { margin-left: 0.5rem; } .mb-2 { margin-bottom: 0.5rem; } .mb-6 { margin-bottom: 1.5rem; } .mb-4 { margin-bottom: 1rem; } .mb-1 { margin-bottom: 0.25rem; } .mt-8 { margin-top: 2rem; } .max-w-sm { max-width: 24rem; } .max-w-2xl { max-width: 42rem; } .max-w-4xl { max-width: 56rem; } .bg-white { background-color: #ffffff; } .bg-gray-100 { background-color: #f3f4f6; } .bg-gray-200 { background-color: #e5e7eb; } .bg-gray-50 { background-color: #f9fafb; } .bg-gray-700 { background-color: #374151; } .hover\\:bg-gray-600:hover { background-color: #4b5563; } .bg-blue-100 { background-color: #dbeafe; } .bg-red-100 { background-color: #fee2e2; } .bg-blue-500 { color: #ffffff; background-color: #3b82f6; } .hover\\:bg-blue-600:hover { background-color: #2563eb; } .bg-red-500 { background-color: #ef4444; } .bg-red-600 { background-color: #dc2626; } .hover\\:bg-red-600:hover { background-color: #dc2626; } .bg-green-500 { background-color: #22c55e; } .bg-green-600 { background-color: #16a34a; } .bg-green-100 { background-color: #dcfce7; } .rounded-2xl { border-radius: 1rem; } .rounded-xl { border-radius: 0.75rem; } .rounded-full { border-radius: 9999px; } .rounded-lg { border-radius: 0.5rem; } .rounded { border-radius: 0.25rem; } .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); } .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05); } .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0,0,0,0.05); } .overflow-hidden { overflow: hidden; } .text-center { text-align: center; } .text-right { text-align: right; } .font-bold { font-weight: 700; } .font-sans { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; } .font-semibold { font-weight: 600; } .font-extrabold { font-weight: 800; } .font-medium { font-weight: 500; } .text-3xl { font-size: 1.875rem; line-height: 2.25rem; } .text-4xl { font-size: 2.25rem; line-height: 2.5rem; } .text-2xl { font-size: 1.5rem; line-height: 2rem; } .text-xl { font-size: 1.25rem; line-height: 1.75rem; } .text-lg { font-size: 1.125rem; line-height: 1.75rem; } .text-sm { font-size: 0.875rem; line-height: 1.25rem; } .text-xs { font-size: 0.75rem; line-height: 1rem; } .gap-2 { gap: 0.5rem; } .gap-4 { gap: 1rem; } .gap-6 { gap: 1.5rem; } .gap-8 { gap: 2rem; } .space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 1rem; } .space-y-2 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.5rem; } .space-x-4 > :not([hidden]) ~ :not([hidden]) { margin-left: 1rem; } .space-x-2 > :not([hidden]) ~ :not([hidden]) { margin-left: 0.5rem; } .border { border-width: 1px; } .border-t { border-top-width: 1px; } .border-gray-300 { border-color: #d1d5db; } .border-gray-200 { border-color: #e5e7eb; } .focus\\:outline-none:focus { outline: 2px solid transparent; outline-offset: 2px; } .focus\\:ring-2:focus { --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color); --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color); box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000); } .focus\\:ring-blue-500:focus { --tw-ring-color: #3b82f6; } .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; } .transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; } .disabled\\:bg-gray-400:disabled { background-color: #9ca3af; } .disabled\\:opacity-50:disabled { opacity: 0.5; } .hover\\:underline:hover { text-decoration-line: underline; } .max-h-80 { max-height: 20rem; } .overflow-y-auto { overflow-y: auto; } .custom-scrollbar::-webkit-scrollbar { width: 8px; } .custom-scrollbar::-webkit-scrollbar-track { background: #e5e7eb; border-radius: 10px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #9ca3af; border-radius: 10px; }
    @media (min-width: 640px) { .sm\\:grid { display: grid; } .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); } .sm\\:p-8 { padding: 2rem; } .sm\\:p-6 { padding: 1.5rem; } .sm\\:text-4xl { font-size: 2.25rem; line-height: 2.5rem; } .sm\\:text-2xl { font-size: 1.5rem; line-height: 2rem; } .sm\\:flex-row { flex-direction: row; } .sm\\:w-auto { width: auto; } }
    @media (min-width: 768px) { .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
    `}</style>
);

// --- Helper function to get the next date based on frequency ---
const getNextDate = (startDate, frequency) => {
    const next = new Date(startDate.getTime());
    switch (frequency) {
        case 'weekly': next.setDate(next.getDate() + 7); break;
        case 'bi-weekly': next.setDate(next.getDate() + 14); break;
        case 'monthly': next.setMonth(next.getMonth() + 1); break;
        case 'annually': next.setFullYear(next.getFullYear() + 1); break;
        default: break;
    }
    return next;
};

const App = () => {
    // --- State Variables ---
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [entries, setEntries] = useState([]);
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


    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Initialize Firebase and Auth listener
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
    
    // Fetch budget entries and user settings
    useEffect(() => {
        if (!db || !userId) return;
        
        const unsubscribeEntries = onSnapshot(collection(db, `artifacts/${appId}/users/${userId}/budgetEntries`), (snapshot) => {
            const entriesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setEntries(entriesData);
        }, (err) => {
            console.error("Error fetching entries:", err);
            setError("Could not fetch budget entries.");
        });

        const unsubscribeSettings = onSnapshot(doc(db, `artifacts/${appId}/users/${userId}`), (doc) => {
            if (doc.exists()) {
                const settings = doc.data().payPeriodSettings;
                if (settings && settings.lastPayDate) {
                    setPayPeriodSettings({
                        lastPayDate: settings.lastPayDate.toDate(),
                        frequency: settings.frequency || 'bi-weekly'
                    });
                }
            }
        }, (err) => {
            console.error("Error fetching settings:", err);
            setError("Could not fetch user settings.");
        });

        return () => {
            unsubscribeEntries();
            unsubscribeSettings();
        };
    }, [db, userId]);

    // Effect to calculate current pay period
    useEffect(() => {
        if (payPeriodSettings.lastPayDate) {
            const start = new Date(payPeriodSettings.lastPayDate.getTime());
            start.setHours(0, 0, 0, 0);

            const end = getNextDate(start, payPeriodSettings.frequency);
            end.setMilliseconds(end.getMilliseconds() - 1); 

            setCurrentPayPeriod({ start, end });
        }
    }, [payPeriodSettings]);

    // --- Event Handlers ---
    const handlePreviousMonth = () => setSelectedDate(d => { const n = new Date(d); n.setMonth(n.getMonth() - 1); return n; });
    const handleNextMonth = () => setSelectedDate(d => { const n = new Date(d); n.setMonth(n.getMonth() + 1); return n; });
    const handlePreviousYear = () => setSelectedDate(d => { const n = new Date(d); n.setFullYear(n.getFullYear() - 1); return n; });
    const handleNextYear = () => setSelectedDate(d => { const n = new Date(d); n.setFullYear(n.getFullYear() + 1); return n; });

    const handleSendMagicLink = async (e) => {
        e.preventDefault();
        if (!auth || !email) return;
        setAuthLoading(true);
        setMessage(null);
        setError(null);
        try {
            await sendSignInLinkToEmail(auth, email, {
                url: window.location.href,
                handleCodeInApp: true,
            });
            window.localStorage.setItem('emailForSignIn', email);
            setMessage(`Sign-in link sent to ${email}! Check your inbox.`);
        } catch (error) {
            setError(error.message);
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLogout = async () => {
        if (!auth) return;
        setAuthLoading(true);
        await signOut(auth);
        setAuthLoading(false);
    };
    
    // --- Memoized Calculations ---
    const displayedEntries = useMemo(() => {
        const currentMonth = selectedDate.getMonth();
        const currentYear = selectedDate.getFullYear();
        
        return entries.flatMap(entry => {
            if (!entry.timestamp?.toDate) return [];
            const startDate = entry.timestamp.toDate();
            
            if (!entry.isRecurring) {
                return startDate.getMonth() === currentMonth && startDate.getFullYear() === currentYear 
                    ? [{ ...entry, timestamp: startDate }] 
                    : [];
            }
            
            const recurringInstances = [];
            let currentDate = new Date(startDate.getTime());
            const cancelDate = entry.cancellationDate?.toDate();

            while (currentDate.getFullYear() < currentYear + 2) {
                if (cancelDate && currentDate > cancelDate) break;
                if (currentDate.getMonth() === currentMonth && currentDate.getFullYear() === currentYear) {
                    recurringInstances.push({ ...entry, timestamp: new Date(currentDate.getTime()), displayId: `${entry.id}-${currentDate.getTime()}` });
                }
                if (currentDate.getFullYear() > currentYear && currentDate.getMonth() > currentMonth) break;
                
                const nextDate = getNextDate(currentDate, entry.recurrenceFrequency);
                if (nextDate.getTime() === currentDate.getTime()) {
                    break;
                }
                currentDate = nextDate;
            }
            return recurringInstances;
        }).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    }, [selectedDate, entries]);
    
    const { totalIncome, totalExpenses, balance } = useMemo(() => {
        let totalIncome = 0;
        let totalExpenses = 0;
        displayedEntries.forEach(entry => {
            if (entry.type === 'income') totalIncome += entry.amount;
            else totalExpenses += entry.amount;
        });
        return { totalIncome, totalExpenses, balance: totalIncome - totalExpenses };
    }, [displayedEntries]);

    const incomeEntries = useMemo(() => displayedEntries.filter(e => e.type === 'income'), [displayedEntries]);
    const expenseEntries = useMemo(() => displayedEntries.filter(e => e.type === 'expense'), [displayedEntries]);

    const allBillsThisPayPeriod = useMemo(() => {
        if (!currentPayPeriod.start || !currentPayPeriod.end) return [];

        const instances = [];
        const allExpenses = entries.filter(e => e.type === 'expense');

        allExpenses.forEach(expense => {
            if (!expense.timestamp?.toDate) return;

            const startDate = expense.timestamp.toDate();
            const cancelDate = expense.cancellationDate?.toDate();
            const paidDates = expense.paidDates || [];

            if (expense.isRecurring) {
                let currentDate = new Date(startDate.getTime());
                while (currentDate <= currentPayPeriod.end) {
                    if (cancelDate && currentDate > cancelDate) break;

                    if (currentDate >= currentPayPeriod.start) {
                        const ymd = currentDate.toISOString().split('T')[0];
                        instances.push({
                            ...expense,
                            timestamp: new Date(currentDate.getTime()),
                            displayId: `${expense.id}-${currentDate.getTime()}`,
                            isPaid: paidDates.includes(ymd),
                            paidDateString: ymd,
                        });
                    }
                    
                    const nextDate = getNextDate(currentDate, expense.recurrenceFrequency);
                    if (nextDate.getTime() === currentDate.getTime()) {
                        console.error("Infinite loop detected for entry, breaking.", expense);
                        break; 
                    }
                    currentDate = nextDate;
                }
            } else {
                const expenseDate = startDate;
                if (expenseDate >= currentPayPeriod.start && expenseDate <= currentPayPeriod.end) {
                    const ymd = expenseDate.toISOString().split('T')[0];
                    instances.push({
                        ...expense,
                        timestamp: expenseDate,
                        isPaid: paidDates.includes(ymd),
                        paidDateString: ymd,
                    });
                }
            }
        });
        return instances.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    }, [entries, currentPayPeriod]);
    
    const upcomingBills = useMemo(() => allBillsThisPayPeriod.filter(bill => !bill.isPaid), [allBillsThisPayPeriod]);
    const paidBillsThisPayPeriod = useMemo(() => allBillsThisPayPeriod.filter(bill => bill.isPaid), [allBillsThisPayPeriod]);

    const totalUpcomingBills = useMemo(() => upcomingBills.reduce((acc, bill) => acc + bill.amount, 0), [upcomingBills]);
    const totalPaidBills = useMemo(() => paidBillsThisPayPeriod.reduce((acc, bill) => acc + bill.amount, 0), [paidBillsThisPayPeriod]);

    // --- Data Handlers ---
    const handleAddEntry = async (entryData) => {
        if (!db || !userId) return;
        try {
            await addDoc(collection(db, `artifacts/${appId}/users/${userId}/budgetEntries`), entryData);
            setMessage(`${entryData.type.charAt(0).toUpperCase() + entryData.type.slice(1)} added successfully!`);
        } catch (e) {
            console.error("Error adding document: ", e);
            setError("Could not add entry. Please try again.");
        }
    };
    
    const handleUpdateEntry = async (id, updatedData, originalEntry, updateAllFuture) => {
        if (!db || !userId) return;
        try {
            const docRef = doc(db, `artifacts/${appId}/users/${userId}/budgetEntries`, id);
            
            if (originalEntry.isRecurring && !updateAllFuture) {
                const batch = writeBatch(db);
    
                const dayBefore = new Date(originalEntry.timestamp.getTime());
                dayBefore.setDate(dayBefore.getDate() - 1);
                batch.update(docRef, { cancellationDate: Timestamp.fromDate(dayBefore) });
    
                const newOneTimeEntry = {
                    ...updatedData,
                    isRecurring: false,
                    cancellationDate: null,
                    recurrenceFrequency: null,
                    paidDates: []
                };
                const newOneTimeDocRef = doc(collection(db, `artifacts/${appId}/users/${userId}/budgetEntries`));
                batch.set(newOneTimeDocRef, newOneTimeEntry);
    
                const newRecurringEntry = {
                    ...originalEntry,
                    ...updatedData,
                    timestamp: Timestamp.fromDate(originalEntry.timestamp)
                };
                delete newRecurringEntry.id;
                delete newRecurringEntry.displayId;
                const newRecurringDocRef = doc(collection(db, `artifacts/${appId}/users/${userId}/budgetEntries`));
                batch.set(newRecurringDocRef, newRecurringEntry);
    
                await batch.commit();
            } else {
                await updateDoc(docRef, updatedData);
            }
            setMessage("Entry updated successfully!");
        } catch (e) {
            console.error("Error updating document: ", e);
            setError("Could not update entry. Please try again.");
        }
    };
    
    const handleDeleteEntry = async (id) => {
        if (!db || !userId) return;
        try {
            await deleteDoc(doc(db, `artifacts/${appId}/users/${userId}/budgetEntries`, id));
            setMessage("Entry deleted successfully.");
        } catch (e) {
            console.error("Error deleting document: ", e);
            setError("Could not delete entry. Please try again.");
        }
    };

    const handleOpenPayModal = (bill) => {
        setBillToPay(bill);
        setIsPayBillModalOpen(true);
    };

    const handleConfirmPayment = async ({ originalBill, paidAmount, paidDate, updateRecurringDate }) => {
        if (!db || !userId) return;
        try {
            const docRef = doc(db, `artifacts/${appId}/users/${userId}/budgetEntries`, originalBill.id);
            const dueDateString = new Date(originalBill.timestamp).toISOString().split('T')[0];

            await updateDoc(docRef, { paidDates: arrayUnion(dueDateString) });

            const amountDifference = originalBill.amount - paidAmount;
            if (Math.abs(amountDifference) > 0.001) {
                const adjustmentEntry = {
                    amount: Math.abs(amountDifference),
                    description: `Payment adjustment for ${originalBill.description}`,
                    isRecurring: false,
                    paidDates: [],
                    recurrenceFrequency: null,
                    cancellationDate: null,
                    timestamp: Timestamp.fromDate(new Date(paidDate)),
                    type: amountDifference > 0 ? 'income' : 'expense',
                };
                await addDoc(collection(db, `artifacts/${appId}/users/${userId}/budgetEntries`), adjustmentEntry);
            }

            if (originalBill.isRecurring && updateRecurringDate) {
                 await updateDoc(docRef, {
                    timestamp: Timestamp.fromDate(new Date(paidDate))
                 });
            }

            setMessage(`${originalBill.description} marked as paid.`);
            setIsPayBillModalOpen(false);
            setBillToPay(null);
        } catch (e) {
            console.error("Error confirming payment:", e);
            setError("Could not confirm payment.");
        }
    };

    const handleUnpayBill = async (billId, paidDateString) => {
        if (!db || !userId) return;
        try {
            const docRef = doc(db, `artifacts/${appId}/users/${userId}/budgetEntries/${billId}`);
            await updateDoc(docRef, {
                paidDates: arrayRemove(paidDateString)
            });
            setMessage("Payment status reverted.");
        } catch (e) {
            console.error("Error undoing payment:", e);
            setError("Could not revert payment status.");
        }
    };


    const handleSaveSettings = async (settings) => {
        if (!db || !userId) return;
        try {
            await setDoc(doc(db, `artifacts/${appId}/users/${userId}`), { payPeriodSettings: settings }, { merge: true });
            setPayPeriodSettings({ 
                ...settings, 
                lastPayDate: settings.lastPayDate.toDate() 
            });
            setIsSettingsModalOpen(false);
        } catch (e) {
            console.error("Error saving settings:", e);
            setMessage("Could not save settings.");
        }
    };

    const handlePreviousPayPeriod = () => {
        const { lastPayDate, frequency } = payPeriodSettings;
        if (!lastPayDate) return;
        let newStartDate;
        switch (frequency) {
            case 'weekly': newStartDate = new Date(lastPayDate.getTime() - 7 * 86400000); break;
            case 'bi-weekly': newStartDate = new Date(lastPayDate.getTime() - 14 * 86400000); break;
            case 'monthly': newStartDate = new Date(new Date(lastPayDate).setMonth(lastPayDate.getMonth() - 1)); break;
            case 'annually': newStartDate = new Date(new Date(lastPayDate).setFullYear(lastPayDate.getFullYear() - 1)); break;
            default: return;
        }
        setPayPeriodSettings(prev => ({ ...prev, lastPayDate: newStartDate }));
    };

    const handleNextPayPeriod = () => {
        const { lastPayDate, frequency } = payPeriodSettings;
        if (!lastPayDate) return;
        const newStartDate = getNextDate(lastPayDate, frequency);
        setPayPeriodSettings(prev => ({ ...prev, lastPayDate: newStartDate }));
    };

    const handleExportCSV = () => {
        if (entries.length === 0) {
            alert("No data to export.");
            return;
        }
        const headers = ["Date", "Description", "Amount", "Type", "Recurring"];
        const rows = displayedEntries.map(entry => [
            new Date(entry.timestamp).toLocaleDateString(),
            entry.description,
            entry.amount,
            entry.type,
            entry.isRecurring ? 'Yes' : 'No'
        ]);
        let csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `budget_export_${selectedDate.getFullYear()}-${selectedDate.getMonth()+1}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatCurrency = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);

    // --- Conditional Renders ---
    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
    );

    if (error && !userId) return (
        <div className="flex items-center justify-center min-h-screen p-4">
             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative max-w-sm text-center" role="alert">
                 <strong className="font-bold block">An error occurred!</strong>
                 <span className="block sm:inline">{error}</span>
             </div>
        </div>
    );

    const renderLogin = () => (
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-2">Welcome!</h1>
            <p className="text-center text-gray-500 mb-6">Sign in with a magic link.</p>
            {message && <div className="bg-blue-100 text-blue-800 p-3 rounded-lg mb-4 text-center text-sm">{message}</div>}
            {error && <div className="bg-red-100 text-red-800 p-3 rounded-lg mb-4 text-center text-sm">{error}</div>}
            <form onSubmit={handleSendMagicLink}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                />
                <button type="submit" disabled={authLoading} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400">
                    {authLoading ? 'Sending...' : 'Send Magic Link'}
                </button>
            </form>
        </div>
    );
    
    const renderEntryListItem = (entry) => (
        <li key={entry.displayId || entry.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm">
            <div>
                <p className="font-semibold">{entry.description}</p>
                <p className="text-sm text-gray-500">{new Date(entry.timestamp).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center">
                <p className={`font-bold mr-4 ${entry.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {entry.type === 'income' ? '+' : '-'}{formatCurrency(entry.amount)}
                </p>
                <button onClick={() => { setEditingEntry(entry); setIsModalOpen(true); setModalType(entry.type); }} className="p-1 text-gray-500 hover:text-blue-500" aria-label="Edit entry">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
                </button>
                 <button onClick={() => handleDeleteEntry(entry.id)} className="p-1 text-gray-500 hover:text-red-500" aria-label="Delete entry">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            </div>
        </li>
    );

    const renderApp = () => (
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-gray-800">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-3xl font-bold">Budget Dashboard</h1>
                    <p className="text-sm text-gray-500">Signed in as: {userEmail || 'N/A'}</p>
                </div>
                <div className="flex gap-2">
                     <button onClick={() => setIsSettingsModalOpen(true)} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Settings">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                    <button onClick={handleLogout} disabled={authLoading} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm">Sign Out</button>
                </div>
            </div>
            
            <h2 className="text-2xl font-bold text-center mb-4">Monthly Overview</h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-6">
                <div className="flex items-center gap-2">
                    <button onClick={handlePreviousMonth} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Previous month"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
                    <h2 className="text-xl font-semibold text-center w-32">{months[selectedDate.getMonth()]}</h2>
                    <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Next month"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handlePreviousYear} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Previous year"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
                    <h2 className="text-xl font-semibold text-center w-20">{selectedDate.getFullYear()}</h2>
                    <button onClick={handleNextYear} className="p-2 rounded-full hover:bg-gray-200 transition-colors" aria-label="Next year"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 bg-gray-100 p-4 rounded-xl text-center shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-600">Income</h3>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
                </div>
                <div className="flex-1 bg-gray-100 p-4 rounded-xl text-center shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-600">Expenses</h3>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
                </div>
                <div className="flex-1 bg-gray-100 p-4 rounded-xl text-center shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-600">Balance</h3>
                    <p className={`text-2xl font-bold ${balance >= 0 ? 'text-gray-800' : 'text-red-600'}`}>{formatCurrency(balance)}</p>
                </div>
            </div>

            <div className="flex justify-center gap-4 mb-8">
                <button onClick={() => { setModalType('income'); setEditingEntry(null); setIsModalOpen(true); }} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">Add Income</button>
                <button onClick={() => { setModalType('expense'); setEditingEntry(null); setIsModalOpen(true); }} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">Add Expense</button>
                <button onClick={handleExportCSV} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">Download CSV</button>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl shadow-sm mb-8">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={handlePreviousPayPeriod} disabled={!payPeriodSettings.lastPayDate} className="p-2 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50" aria-label="Previous pay period"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-gray-700">Pay Period Bills</h2>
                        {currentPayPeriod.start && currentPayPeriod.end ? (
                            <p className="text-sm text-gray-500">{currentPayPeriod.start.toLocaleDateString()} - {currentPayPeriod.end.toLocaleDateString()}</p>
                        ) : (
                             <p className="text-sm text-gray-500">Set your pay period in Settings</p>
                        )}
                    </div>
                    <button onClick={handleNextPayPeriod} disabled={!payPeriodSettings.lastPayDate} className="p-2 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50" aria-label="Next pay period"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
                </div>

                <div>
                    <h3 className="font-bold text-gray-600 mb-2">Upcoming</h3>
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                        {allBillsThisPayPeriod.length === 0 && (
                             <p className="text-center text-gray-500 py-4">No bills due this pay period!</p>
                        )}
                        {upcomingBills.length > 0 ? (
                            upcomingBills.map(bill => (
                                <div key={bill.displayId} className="flex justify-between items-center bg-white p-2 rounded-lg">
                                    <div className="flex items-center">
                                        <button onClick={() => handleOpenPayModal(bill)} className="p-1 mr-2 text-gray-400 hover:text-green-500" aria-label={`Pay ${bill.description}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </button>
                                        <div>
                                            <p className="font-medium">{bill.description}</p>
                                            <p className="text-sm text-gray-500">Due: {bill.timestamp.toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <p className="font-semibold text-red-600">{formatCurrency(bill.amount)}</p>
                                </div>
                            ))
                        ) : ( allBillsThisPayPeriod.length > 0 && <p className="text-center text-gray-500 py-4">All bills paid for this period!</p>)}
                    </div>
                    {upcomingBills.length > 0 && (
                        <div className="mt-4 pt-2 border-t border-gray-200 text-right">
                            <p className="font-bold text-lg">Total Due: <span className="text-red-600">{formatCurrency(totalUpcomingBills)}</span></p>
                        </div>
                    )}
                </div>

                {paidBillsThisPayPeriod.length > 0 && (
                    <div className="mt-6">
                        <h3 className="font-bold text-gray-600 mb-2 border-t border-gray-200 pt-4">Paid This Period</h3>
                        <div className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                            {paidBillsThisPayPeriod.map(bill => (
                                <div key={bill.displayId} className="flex justify-between items-center bg-white p-2 rounded-lg opacity-70">
                                    <div className="flex items-center">
                                         <button onClick={() => handleUnpayBill(bill.id, bill.paidDateString)} className="p-1 mr-2 text-gray-400 hover:text-red-500" aria-label={`Undo payment for ${bill.description}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </button>
                                        <div>
                                            <p className="font-medium line-through">{bill.description}</p>
                                            <p className="text-sm text-gray-500">Due: {bill.timestamp.toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <p className="font-semibold text-green-600 line-through">{formatCurrency(bill.amount)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-2 border-t border-gray-200 text-right">
                            <p className="font-bold text-lg">Total Paid: <span className="text-green-600">{formatCurrency(totalPaidBills)}</span></p>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2">
                <div>
                    <h2 className="text-xl font-bold mb-4">Income</h2>
                    <ul className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">{incomeEntries.length > 0 ? incomeEntries.map(renderEntryListItem) : <li className="text-center text-gray-500">No income this month.</li>}</ul>
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-4">Expenses</h2>
                    <ul className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">{expenseEntries.length > 0 ? expenseEntries.map(renderEntryListItem) : <li className="text-center text-gray-500">No expenses this month.</li>}</ul>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
            <TailwindStyles />
            {isModalOpen && <AddEntryModal onClose={() => { setIsModalOpen(false); setEditingEntry(null); }} onAddEntry={handleAddEntry} onUpdateEntry={handleUpdateEntry} initialType={modalType} authLoading={authLoading} entryToEdit={editingEntry} />}
            {isSettingsModalOpen && <SettingsModal onClose={() => setIsSettingsModalOpen(false)} onSave={handleSaveSettings} currentSettings={payPeriodSettings} />}
            {isPayBillModalOpen && <PayBillModal onClose={() => setIsPayBillModalOpen(false)} onSave={handleConfirmPayment} bill={billToPay} />}
            {userId ? renderApp() : renderLogin()}
        </div>
    );
};

// --- Child Components ---

const AddEntryModal = ({ onClose, onAddEntry, onUpdateEntry, initialType, authLoading, entryToEdit }) => {
    const [type, setType] = useState(initialType);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurrenceFrequency, setRecurrenceFrequency] = useState('monthly');
    const [updateAllFuture, setUpdateAllFuture] = useState(true);

    useEffect(() => {
        if (entryToEdit) {
            setType(entryToEdit.type);
            setDescription(entryToEdit.description);
            setAmount(entryToEdit.amount);
            setDate(new Date(entryToEdit.timestamp.seconds ? entryToEdit.timestamp.seconds * 1000 : entryToEdit.timestamp).toISOString().split('T')[0]);
            setIsRecurring(entryToEdit.isRecurring);
            setRecurrenceFrequency(entryToEdit.recurrenceFrequency || 'monthly');
        }
    }, [entryToEdit]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const [year, month, day] = date.split('-').map(Number);
        const timestamp = Timestamp.fromDate(new Date(Date.UTC(year, month - 1, day)));
        
        const entryData = {
            type,
            description,
            amount: parseFloat(amount),
            timestamp,
            isRecurring,
            recurrenceFrequency: isRecurring ? recurrenceFrequency : null,
            cancellationDate: null,
            paidDates: [],
        };

        if (entryToEdit) {
            onUpdateEntry(entryToEdit.id, entryData, entryToEdit, updateAllFuture);
        } else {
            onAddEntry(entryData);
        }
        onClose();
    };

    return (
         <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose} className="modal-close-btn" aria-label="Close modal"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                <h2 className="text-2xl font-bold mb-6 text-center">{entryToEdit ? 'Edit' : 'Add'} {type === 'income' ? 'Income' : 'Expense'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-lg"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                            <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required min="0.01" step="0.01" className="w-full p-2 border border-gray-300 rounded-lg"/>
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-lg"/>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" id="isRecurring" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} className="h-4 w-4 rounded"/>
                        <label htmlFor="isRecurring" className="ml-2 text-sm font-medium text-gray-700">Is this a recurring transaction?</label>
                    </div>
                    {isRecurring && (
                        <div>
                            <label htmlFor="recurrenceFrequency" className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                            <select id="recurrenceFrequency" value={recurrenceFrequency} onChange={(e) => setRecurrenceFrequency(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg">
                                <option value="weekly">Weekly</option>
                                <option value="bi-weekly">Bi-Weekly</option>
                                <option value="every-4-weeks">Every 4 Weeks</option>
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="annually">Annually</option>
                            </select>
                        </div>
                    )}
                    {entryToEdit && entryToEdit.isRecurring && (
                        <div className="bg-gray-100 p-3 rounded-lg">
                            <p className="text-sm font-medium text-gray-800 mb-2">This is a recurring entry. Which instances do you want to update?</p>
                             <div className="flex items-center mb-2">
                                <input type="radio" id="updateAllFuture" name="updateScope" checked={updateAllFuture} onChange={() => setUpdateAllFuture(true)} className="h-4 w-4"/>
                                <label htmlFor="updateAllFuture" className="ml-2 text-sm">This and all future entries</label>
                            </div>
                            <div className="flex items-center">
                                <input type="radio" id="updateThisOnly" name="updateScope" checked={!updateAllFuture} onChange={() => setUpdateAllFuture(false)} className="h-4 w-4"/>
                                <label htmlFor="updateThisOnly" className="ml-2 text-sm">Only this entry</label>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" disabled={authLoading} className={`py-2 px-4 text-white rounded-lg ${type === 'income' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                            {entryToEdit ? 'Update' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const PayBillModal = ({ onClose, onSave, bill }) => {
    const [paidAmount, setPaidAmount] = useState('');
    const [paidDate, setPaidDate] = useState('');
    const [updateRecurringDate, setUpdateRecurringDate] = useState(false);

    useEffect(() => {
        if (bill) {
            setPaidAmount(bill.amount);
            setPaidDate(new Date().toISOString().split('T')[0]); // Default to today
        }
    }, [bill]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            originalBill: bill,
            paidAmount: parseFloat(paidAmount),
            paidDate: new Date(paidDate),
            updateRecurringDate,
        });
    };

    if (!bill) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose} className="modal-close-btn" aria-label="Close modal"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                <h2 className="text-2xl font-bold mb-2 text-center">Confirm Payment</h2>
                <p className="text-center text-gray-600 mb-6">{bill.description}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="paidAmount" className="block text-sm font-medium text-gray-700 mb-1">Amount Paid</label>
                            <input type="number" id="paidAmount" value={paidAmount} onChange={(e) => setPaidAmount(e.target.value)} required min="0.01" step="0.01" className="w-full p-2 border border-gray-300 rounded-lg" />
                        </div>
                        <div>
                            <label htmlFor="paidDate" className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                            <input type="date" id="paidDate" value={paidDate} onChange={(e) => setPaidDate(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-lg" />
                        </div>
                    </div>
                    {bill.isRecurring && (
                        <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                            <input type="checkbox" id="updateRecurring" checked={updateRecurringDate} onChange={(e) => setUpdateRecurringDate(e.target.checked)} className="h-4 w-4 rounded" />
                            <label htmlFor="updateRecurring" className="ml-2 text-sm font-medium text-gray-700">Update future payments to this date?</label>
                        </div>
                    )}
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700">Confirm Payment</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const SettingsModal = ({ onClose, onSave, currentSettings }) => {
    const [lastPayDate, setLastPayDate] = useState('');
    const [frequency, setFrequency] = useState('bi-weekly');

    useEffect(() => {
        if (currentSettings.lastPayDate) {
            const date = new Date(currentSettings.lastPayDate.getTime());
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            setLastPayDate(`${year}-${month}-${day}`);
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
        const dateObject = Timestamp.fromDate(new Date(Date.UTC(year, month - 1, day)));
        onSave({ lastPayDate: dateObject, frequency });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose} className="modal-close-btn" aria-label="Close modal"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                <h2 className="text-2xl font-bold mb-6 text-center">Pay Period Settings</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="lastPayDate" className="block text-sm font-medium text-gray-700 mb-1">Last Pay Date</label>
                        <input type="date" id="lastPayDate" value={lastPayDate} onChange={(e) => setLastPayDate(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                    </div>
                    <div>
                        <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">Pay Frequency</label>
                        <select id="frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                            <option value="weekly">Weekly</option>
                            <option value="bi-weekly">Bi-Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="annually">Annually</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default App;
