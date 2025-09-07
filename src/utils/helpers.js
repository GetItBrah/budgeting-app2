export const PREDEFINED_EXPENSE_CATEGORIES = [
    'Groceries', 'Utilities', 'Rent/Mortgage', 'Gas', 'Dining Out',
    'Entertainment', 'Shopping', 'Health', 'Travel', 'Subscriptions', 'Other'
];
export const PREDEFINED_INCOME_CATEGORIES = ['Salary', 'Bonus', 'Freelance', 'Other'];

export const getNextDate = (startDate, frequency) => {
    const next = new Date(startDate.getTime());
    switch (frequency) {
        case 'weekly': next.setDate(next.getDate() + 7); break;
        case 'bi-weekly': next.setDate(next.getDate() + 14); break;
        case 'every-4-weeks': next.setDate(next.getDate() + 28); break;
        case 'monthly': next.setMonth(next.getMonth() + 1); break;
        case 'annually': next.setFullYear(next.getFullYear() + 1); break;
        default: break;
    }
    return next;
};

export const formatCurrency = (v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);