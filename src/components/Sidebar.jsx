import React from 'react';

const Sidebar = ({ currentView, setCurrentView }) => {
    const navItemClasses = "w-full flex items-center px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors";
    const activeNavItemClasses = "bg-blue-600 text-white hover:bg-blue-600";

    return (
        <aside className="w-full md:w-64 md:flex-shrink-0 bg-gray-800 p-4 border-r border-gray-700">
            <h1 className="text-2xl font-bold text-white mb-8">Budget App</h1>
            <nav>
                <ul className="space-y-2">
                    <li>
                        <button onClick={() => setCurrentView('dashboard')} className={`${navItemClasses} ${currentView === 'dashboard' ? activeNavItemClasses : ''}`}>
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                            Dashboard
                        </button>
                    </li>
                    <li>
                        <button onClick={() => setCurrentView('accounts')} className={`${navItemClasses} ${currentView === 'accounts' ? activeNavItemClasses : ''}`}>
                             <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                             Accounts
                        </button>
                    </li>
                    <li>
                        <button onClick={() => setCurrentView('yearly-summary')} className={`${navItemClasses} ${currentView === 'yearly-summary' ? activeNavItemClasses : ''}`}>
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            Yearly Summary
                        </button>
                    </li>
                    <li>
                        <button onClick={() => setCurrentView('import')} className={`${navItemClasses} ${currentView === 'import' ? activeNavItemClasses : ''}`}>
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            Import
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;