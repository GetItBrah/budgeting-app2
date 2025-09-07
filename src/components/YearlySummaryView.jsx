import React, { useMemo } from 'react';

const YearlySummaryView = ({ entries, formatCurrency }) => {
    const yearlyData = useMemo(() => {
        const data = {};
        entries.forEach(entry => {
            if (!entry.timestamp?.toDate) return;
            const date = entry.timestamp.toDate();
            const year = date.getFullYear();
            const month = date.getMonth();
            const key = `${year}-${month}`;

            if (!data[key]) {
                data[key] = { year, month, income: 0, expenses: 0 };
            }
            if (entry.type === 'income') {
                data[key].income += entry.amount;
            } else {
                data[key].expenses += entry.amount;
            }
        });
        return Object.values(data).sort((a, b) => b.year - a.year || b.month - a.month);
    }, [entries]);

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 md:p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-200">Yearly Summary</h1>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-gray-700">
                        <tr>
                            <th className="p-3 font-semibold text-gray-300">Month</th>
                            <th className="p-3 font-semibold text-right text-gray-300">Income</th>
                            <th className="p-3 font-semibold text-right text-gray-300">Expenses</th>
                            <th className="p-3 font-semibold text-right text-gray-300">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {yearlyData.map(({ year, month, income, expenses }) => {
                            const balance = income - expenses;
                            return (
                                <tr key={`${year}-${month}`} className="border-b border-gray-700 last:border-b-0">
                                    <td className="p-3 font-medium text-gray-300">{new Date(year, month).toLocaleString('default', { month: 'long' })} {year}</td>
                                    <td className="p-3 text-right text-green-400">{formatCurrency(income)}</td>
                                    <td className="p-3 text-right text-red-400">{formatCurrency(expenses)}</td>
                                    <td className={`p-3 text-right font-bold ${balance >= 0 ? 'text-gray-200' : 'text-red-400'}`}>{formatCurrency(balance)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default YearlySummaryView;