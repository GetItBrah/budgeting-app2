import React from 'react';

const Sidebar = ({ currentView, setCurrentView, onLinkClick, isMobile = false }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'accounts', label: 'Accounts' },
        { id: 'yearly-summary', label: 'Yearly Summary' },
        { id: 'import', label: 'Import' },
    ];

    const baseClasses = "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors";
    const activeClasses = "bg-blue-600 text-white";
    const inactiveClasses = "hover:bg-gray-700";
    const mobileClasses = "text-xl justify-center";

    return (
        <aside className={isMobile ? '' : 'w-64 bg-gray-800 p-4 border-r border-gray-700 h-screen'}>
            {!isMobile && <h1 className="text-2xl font-bold text-center mb-8">Budget App</h1>}
            <nav className={isMobile ? 'flex flex-col items-center space-y-6' : 'space-y-2'}>
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => {
                            setCurrentView(item.id);
                            if (onLinkClick) onLinkClick();
                        }}
                        className={`${baseClasses} ${currentView === item.id ? activeClasses : inactiveClasses} ${isMobile ? mobileClasses : ''}`}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
