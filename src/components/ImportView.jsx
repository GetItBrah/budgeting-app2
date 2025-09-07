import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import TransactionReviewTable from './TransactionReviewTable'; 

const ImportView = ({ accounts, onSaveTransactions }) => {
    const [parsedData, setParsedData] = useState([]);
    const [fileName, setFileName] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setError('');
        setFileName(file.name);
        
        Papa.parse(file, {
            header: true,
            skipEmptyLines: 'greedy',
            beforeFirstChunk: (chunk) => {
                const lines = chunk.split(/\r\n|\n|\r/);
                const headerRowIndex = lines.findIndex(line => 
                    line.toLowerCase().includes("date") && line.toLowerCase().includes("description")
                );
                
                if (headerRowIndex === -1) {
                    setError("Could not find a valid header row in your CSV. Please ensure it contains columns for 'Date' and 'Description'.");
                    return '';
                }

                const summaryRowIndex = lines.findIndex(line => line.toLowerCase().includes("summary"));
                
                const endRow = summaryRowIndex !== -1 ? summaryRowIndex : lines.length;
                const dataChunk = lines.slice(headerRowIndex, endRow).join('\n');
                
                return dataChunk;
            },
            complete: (results) => {
                if (results.errors.length > 0 && results.data.length === 0) {
                     if (!error) {
                        setError('There was an error parsing the CSV file. Please ensure it is formatted correctly.');
                     }
                    setParsedData([]);
                } else {
                    const validData = results.data.filter(row => {
                        const dateKey = Object.keys(row).find(k => k.toLowerCase().includes('date'));
                        return row[dateKey];
                    });

                    if (validData.length === 0 && !error) {
                        setError("No valid transaction rows could be found in the file.");
                    }
                    setParsedData(validData);
                }
            },
            error: (err) => {
                console.error("PapaParse Error:", err);
                setError('A critical error occurred while reading the file.');
                setParsedData([]);
            }
        });
    };
    
    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleCancel = () => {
        setParsedData([]);
        setFileName('');
        setError('');
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-200">Import Transactions</h1>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 md:p-8">
                {parsedData.length === 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-gray-400">
                            {/* Column 1: How to Import */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-gray-200">How to Import</h2>
                                <div className="flex items-start gap-4">
                                    <div className="step-circle">1</div>
                                    <p><strong className="font-medium text-gray-300">Upload:</strong> Click the "Choose File" button below to select a .csv file from your computer.</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="step-circle">2</div>
                                    <p><strong className="font-medium text-gray-300">Review:</strong> Edit any details in the table that appears. You can change dates, descriptions, amounts, and assign accounts or categories.</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="step-circle">3</div>
                                    <p><strong className="font-medium text-gray-300">Import:</strong> Uncheck any transactions you don't want, then click the final "Import Transactions" button to save.</p>
                                </div>
                            </div>

                            {/* Column 2: Formatting Guide */}
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-gray-200">Formatting Guide</h2>
                                <div className="flex items-start gap-4">
                                    <div className="step-circle text-blue-400">✓</div>
                                    <p><strong className="font-medium text-gray-300">Header Row:</strong> Your file must have a header row with at least "Date" and "Description".</p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="step-circle text-blue-400">✓</div>
                                    <div>
                                        <p><strong className="font-medium text-gray-300">Amount Columns:</strong> Use one of these two formats for best results.</p>
                                        <div className="mt-2 text-sm">
                                            <p className="font-semibold text-gray-300">A) Separate "Credit" & "Debit" columns (Recommended)</p>
                                            <p className="font-semibold text-gray-300 mt-2">B) A single "Amount" column with negative numbers for expenses.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center border-t border-gray-700 pt-8">
                            <input
                                type="file"
                                accept=".csv"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <button 
                                onClick={handleUploadClick}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                            >
                                Choose File
                            </button>
                            {fileName && <p className="text-gray-400 mt-4">Selected file: {fileName}</p>}
                            {error && <p className="text-red-400 mt-4 font-semibold">{error}</p>}
                        </div>
                    </>
                ) : (
                    <TransactionReviewTable 
                        data={parsedData} 
                        accounts={accounts}
                        onSave={onSaveTransactions} 
                        onCancel={handleCancel}
                    />
                )}
            </div>
        </div>
    );
};

export default ImportView;