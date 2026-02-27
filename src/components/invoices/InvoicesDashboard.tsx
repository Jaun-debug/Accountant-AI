"use client";

import React, { useState } from 'react';
import { FileText, Plus, Download, Filter, MoreHorizontal, X } from 'lucide-react';

const mockInvoices = [
    { id: 'INV-2026-001', client: 'Acme Corp', amount: '$4,500.00', status: 'Paid', date: 'Feb 12, 2026' },
    { id: 'INV-2026-002', client: 'TechFlow', amount: '$8,200.00', status: 'Pending', date: 'Feb 18, 2026' },
    { id: 'INV-2026-003', client: 'Global Dynamics', amount: '$2,100.00', status: 'Overdue', date: 'Jan 25, 2026' },
];

export default function InvoicesDashboard() {
    const [invoices, setInvoices] = useState(mockInvoices);
    const [showModal, setShowModal] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    // Form fields
    const [client, setClient] = useState('');
    const [amount, setAmount] = useState('');

    const handleAddInvoice = (e: React.FormEvent) => {
        e.preventDefault();
        if (!client || !amount) return;

        const newInvoice = {
            id: `INV-2026-00${invoices.length + 1}`,
            client,
            amount: `$${parseFloat(amount).toFixed(2)}`,
            status: 'Pending',
            date: 'Feb 22, 2026'
        };

        setInvoices([newInvoice, ...invoices]);
        setShowModal(false);
        setClient('');
        setAmount('');
    };

    const handleDelete = (id: string) => {
        setInvoices(invoices.filter(inv => inv.id !== id));
        setActiveDropdown(null);
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">Invoices</h1>
                    <p className="text-neutral-500 font-medium mt-1">Manage and track your client billing.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-white border border-neutral-200 px-4 py-2 rounded-xl text-sm font-bold text-neutral-600 hover:bg-neutral-50 transition-colors shadow-sm">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                    <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm">
                        <Plus className="w-4 h-4" /> New Invoice
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                    <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-emerald-600" /> Recent Invoices
                    </h2>
                    <button aria-label="Download invoices" className="p-2 text-neutral-400 hover:text-emerald-600 transition-colors rounded-lg hover:bg-white"><Download className="w-5 h-5" /></button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-neutral-100 bg-neutral-50/30">
                                <th className="p-6 text-xs font-bold text-neutral-400 uppercase tracking-widest">Invoice ID</th>
                                <th className="p-6 text-xs font-bold text-neutral-400 uppercase tracking-widest">Client</th>
                                <th className="p-6 text-xs font-bold text-neutral-400 uppercase tracking-widest">Date</th>
                                <th className="p-6 text-xs font-bold text-neutral-400 uppercase tracking-widest">Amount</th>
                                <th className="p-6 text-xs font-bold text-neutral-400 uppercase tracking-widest">Status</th>
                                <th className="p-6 text-xs font-bold text-neutral-400 uppercase tracking-widest"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {invoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-neutral-50/50 transition-colors">
                                    <td className="p-6 font-medium text-neutral-900">{inv.id}</td>
                                    <td className="p-6 font-bold text-neutral-900">{inv.client}</td>
                                    <td className="p-6 text-neutral-500 font-medium">{inv.date}</td>
                                    <td className="p-6 font-mono font-bold text-neutral-900">{inv.amount}</td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' :
                                            inv.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                                                'bg-red-50 text-red-700'
                                            }`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="p-6 text-right relative">
                                        <button
                                            onClick={() => setActiveDropdown(activeDropdown === inv.id ? null : inv.id)}
                                            aria-label="More options"
                                            className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors rounded-lg hover:bg-neutral-100"
                                        >
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>

                                        {activeDropdown === inv.id && (
                                            <div className="absolute right-8 top-12 w-32 bg-white border border-neutral-100 shadow-lg rounded-xl overflow-hidden z-10 animate-in fade-in zoom-in-95">
                                                <button className="w-full text-left px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">Edit</button>
                                                <button
                                                    onClick={() => handleDelete(inv.id)}
                                                    className="w-full text-left px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Invoice Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-neutral-900">Create New Invoice</h2>
                            <button onClick={() => setShowModal(false)} aria-label="Close" className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddInvoice} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">Client Name</label>
                                <input
                                    type="text"
                                    value={client}
                                    onChange={(e) => setClient(e.target.value)}
                                    placeholder="e.g., Acme Corp"
                                    className="w-full p-4 bg-neutral-50 border-2 border-neutral-100 rounded-xl focus:border-emerald-500 focus:ring-0 outline-none transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">Amount</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="e.g., 4500.00"
                                    className="w-full p-4 bg-neutral-50 border-2 border-neutral-100 rounded-xl focus:border-emerald-500 focus:ring-0 outline-none transition-colors"
                                    required
                                />
                            </div>

                            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-xl font-bold transition-colors shadow-sm mt-4">
                                Send Invoice
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
