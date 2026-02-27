"use client";

import React, { useState, useRef } from 'react';
import {
    Zap,
    Upload,
    Search,
    Download,
    CheckCircle,
    Loader2,
    FileText,
    Filter,
    ArrowRight,
    Calculator
} from 'lucide-react';
import { useAccountantStore } from '@/store/useAccountantStore';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function AIExtractor() {
    const {
        extractionResults,
        setExtractionResults,
        isExtracting,
        setIsExtracting
    } = useAccountantStore();

    const [file, setFile] = useState<File | null>(null);
    const [keywords, setKeywords] = useState('');
    const [listName, setListName] = useState('');
    const [clientName, setClientName] = useState('');
    const [transactionType, setTransactionType] = useState('auto');
    const [savingText, setSavingText] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExtract = async () => {
        if (!file) {
            alert("Please select a statement file (PDF/Image) to analyze.");
            return;
        }

        setIsExtracting(true);
        setExtractionResults(null);

        try {
            const results = await api.analyzeStatement(file, keywords, listName);
            setExtractionResults(results);
        } catch (error: any) {
            alert(`Extraction failed: ${error.message}`);
        } finally {
            setIsExtracting(false);
        }
    };

    const handleSaveToClient = async () => {
        if (!clientName) {
            alert("Please enter a Client Name first.");
            return;
        }

        if (!extractionResults?.transactions) {
            alert("No transactions extracted.");
            return;
        }

        setSavingText('Separating & Saving...');

        try {
            const res = await api.saveTransactions({
                clientName,
                listName: listName || 'Extracted',
                transactions: extractionResults.transactions,
                transactionType
            });
            alert(`Success: ${res.message}`);
        } catch (error) {
            alert("Failed to connect to server.");
        } finally {
            setSavingText(null);
        }
    };

    const handleExportCSV = () => {
        if (!extractionResults?.transactions) return;

        const csvContent = "data:text/csv;charset=utf-8,"
            + "Date,Description,Amount\n"
            + extractionResults.transactions.map(t => `${t.date},"${t.description}",${t.amount}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${listName || 'Extracted'}_Transactions.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatAmount = (val: any) => {
        const amount = typeof val === 'number' ? val : parseFloat(val);
        if (isNaN(amount)) return "0.00";
        return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true });
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-neutral-900 tracking-tight flex items-center gap-4">
                        <Zap className="w-10 h-10 text-yellow-500 fill-yellow-500" />
                        AI Extraction Engine
                    </h1>
                    <p className="text-neutral-500 font-medium mt-1">Intelligent OCR and transaction mapping for messy bank statements.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Input Panel */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white p-8 rounded-[32px] border border-neutral-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 blur-3xl opacity-50"></div>

                        <div className="relative space-y-8">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={cn(
                                    "w-full h-56 border-2 border-dashed rounded-[24px] flex flex-col items-center justify-center cursor-pointer transition-all group",
                                    file ? "border-emerald-500 bg-emerald-50/30" : "border-neutral-200 bg-neutral-50/50 hover:bg-neutral-50"
                                )}
                            >
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Upload className={cn("w-8 h-8", file ? "text-emerald-600" : "text-neutral-400")} />
                                </div>
                                <p className="text-sm font-bold text-neutral-900">{file ? file.name : "Click to upload statement"}</p>
                                <p className="text-xs text-neutral-400 font-medium mt-1 uppercase tracking-tight">PDF, JPG, PNG (MAX 20MB)</p>
                                {file && (
                                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-600 bg-white px-3 py-1.5 rounded-full shadow-sm">
                                        <CheckCircle className="w-3.5 h-3.5" /> Ready for Analysis
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    className="hidden"
                                    accept=".pdf,image/*"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest pl-1">List Context</label>
                                    <input
                                        type="text"
                                        value={listName}
                                        onChange={(e) => setListName(e.target.value)}
                                        placeholder="e.g. Monthly Grocery Expenses"
                                        className="w-full px-5 py-4 bg-neutral-50 rounded-2xl border-transparent focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm font-medium outline-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest pl-1">Client Folder</label>
                                    <input
                                        type="text"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                        placeholder="e.g. Acme Corp"
                                        className="w-full px-5 py-4 bg-neutral-50 rounded-2xl border-transparent focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm font-medium outline-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest pl-1">Search Keywords</label>
                                    <input
                                        type="text"
                                        value={keywords}
                                        onChange={(e) => setKeywords(e.target.value)}
                                        placeholder="e.g. SPAR, Total, Utilities"
                                        className="w-full px-5 py-4 bg-neutral-50 rounded-2xl border-transparent focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm font-medium outline-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest pl-1">Balance Policy</label>
                                    <div className="flex bg-neutral-100 p-1.5 rounded-2xl gap-1">
                                        {['auto', 'debit', 'credit'].map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setTransactionType(t)}
                                                className={cn(
                                                    "flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                                                    transactionType === t
                                                        ? "bg-white text-emerald-700 shadow-sm"
                                                        : "text-neutral-400 hover:text-neutral-600"
                                                )}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleExtract}
                                disabled={isExtracting || !file}
                                className={cn(
                                    "w-full py-5 rounded-[24px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all",
                                    isExtracting || !file
                                        ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                                        : "bg-neutral-900 text-white hover:bg-neutral-800 shadow-xl shadow-neutral-200"
                                )}
                            >
                                {isExtracting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="w-5 h-5 fill-current" />
                                        Process Statement
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right: Results Panel */}
                <div className="lg:col-span-7 h-full">
                    <div className="bg-white rounded-[32px] border border-neutral-100 shadow-sm flex flex-col h-[750px] overflow-hidden">
                        <div className="p-8 border-b border-neutral-100 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-neutral-900">
                                {extractionResults?.listName || "Extraction Results"}
                            </h3>
                            {extractionResults && (
                                <div className="flex items-center gap-4">
                                    <span className={cn(
                                        "px-4 py-2 text-sm font-black rounded-xl",
                                        extractionResults.transactions.reduce((s, t) => s + (typeof t.amount === 'number' ? t.amount : parseFloat(t.amount as any)), 0) < 0
                                            ? "bg-red-50 text-red-600"
                                            : "bg-emerald-50 text-emerald-600"
                                    )}>
                                        TOTAL: {extractionResults.transactions.reduce((s, t) => s + (typeof t.amount === 'number' ? t.amount : parseFloat(t.amount as any)), 0) < 0 ? '-' : ''}N${formatAmount(Math.abs(extractionResults.transactions.reduce((s, t) => s + (typeof t.amount === 'number' ? t.amount : parseFloat(t.amount as any)), 0)))}
                                    </span>
                                    <span className="bg-neutral-100 text-neutral-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider hidden sm:block">
                                        {extractionResults.transactions.length} Transactions
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-4 bg-neutral-50/30">
                            {!extractionResults && !isExtracting ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-neutral-100 flex items-center justify-center mb-6">
                                        <Search className="w-10 h-10 text-neutral-100" />
                                    </div>
                                    <h4 className="text-lg font-bold text-neutral-900">Waiting for Data</h4>
                                    <p className="text-sm text-neutral-400 max-w-xs mt-2 font-medium">Upload a bank statement and click process to see intelligent transaction mapping.</p>
                                </div>
                            ) : isExtracting ? (
                                <div className="space-y-4">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="h-20 bg-white rounded-2xl border border-neutral-100 animate-pulse"></div>
                                    ))}
                                </div>
                            ) : (
                                extractionResults?.transactions.map((t, idx) => (
                                    <div key={idx} className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                                                (typeof t.amount === 'number' ? t.amount : parseFloat(t.amount as any)) < 0 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"
                                            )}>
                                                {(typeof t.amount === 'number' ? t.amount : parseFloat(t.amount as any)) < 0 ? <Filter className="w-6 h-6 rotate-180" /> : <ArrowRight className="w-6 h-6 -rotate-45" />}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-neutral-300 uppercase tracking-widest leading-none mb-1.5">{t.date}</p>
                                                <p className="text-sm font-bold text-neutral-800 truncate max-w-[300px]">{t.description}</p>
                                            </div>
                                        </div>
                                        <p className={cn(
                                            "text-lg font-black tabular-nums transition-transform group-hover:scale-110 origin-right",
                                            (typeof t.amount === 'number' ? t.amount : parseFloat(t.amount as any)) < 0 ? "text-red-500" : "text-emerald-600"
                                        )}>
                                            {(typeof t.amount === 'number' ? t.amount : parseFloat(t.amount as any)) < 0 ? '-' : '+'}{formatAmount(Math.abs((typeof t.amount === 'number' ? t.amount : parseFloat(t.amount as any))))}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>

                        {extractionResults && (
                            <div className="p-8 border-t border-neutral-100 bg-white flex flex-col md:flex-row gap-4">
                                <button
                                    onClick={handleExportCSV}
                                    className="flex-1 px-6 py-4 border-2 border-neutral-100 text-neutral-600 rounded-2xl font-bold hover:bg-neutral-50 transition-all flex items-center justify-center gap-3"
                                >
                                    <Download className="w-5 h-5" />
                                    Export CSV
                                </button>
                                <button
                                    onClick={handleSaveToClient}
                                    disabled={!clientName || !!savingText}
                                    className="flex-1 px-6 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200/50 flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {savingText ? savingText : (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            Save & Partition
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
