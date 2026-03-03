"use client";

import React, { useState } from 'react';
import { Globe, RefreshCcw, Zap, Plus, Trash2, CheckCircle2, SlidersHorizontal, CreditCard, Shield, X } from 'lucide-react';

import { useAccountantStore, AIRule } from '@/store/useAccountantStore';

export default function SettingsDashboard() {
    const rules = useAccountantStore(state => state.aiRules);
    const addAIRule = useAccountantStore(state => state.addAIRule);
    const deleteAIRule = useAccountantStore(state => state.deleteAIRule);

    const [activeTab, setActiveTab] = useState<'localization' | 'ai-rules' | 'account'>('localization');
    const [isSaving, setIsSaving] = useState(false);

    // Rule State
    const [showRuleModal, setShowRuleModal] = useState(false);
    const [newRuleDesc, setNewRuleDesc] = useState('');
    const [newRuleCond, setNewRuleCond] = useState('');
    const [newRuleAct, setNewRuleAct] = useState('');

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 800);
    };

    const handleAddRule = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRuleDesc || !newRuleCond || !newRuleAct) return;

        const newRule: AIRule = {
            id: Date.now(),
            description: newRuleDesc,
            condition: newRuleCond,
            action: newRuleAct
        };

        addAIRule(newRule);
        setShowRuleModal(false);
        setNewRuleDesc('');
        setNewRuleCond('');
        setNewRuleAct('');
    };

    const handleDeleteRule = (id: number) => {
        deleteAIRule(id);
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">System Settings</h1>
                    <p className="text-neutral-500 font-medium mt-1">Configure multi-currency, AI automation rules, and account preferences.</p>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-sm w-fit min-w-[140px] justify-center"
                >
                    {isSaving ? <RefreshCcw className="w-5 h-5 animate-spin" /> : 'Save Changes'}
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Side Navigation */}
                <div className="w-full lg:w-64 shrink-0 space-y-2">
                    <button
                        onClick={() => setActiveTab('localization')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors text-left ${activeTab === 'localization' ? 'bg-white border-2 border-emerald-600 text-emerald-700 shadow-sm' : 'bg-transparent border-2 border-transparent text-neutral-500 hover:bg-neutral-100'}`}
                    >
                        <Globe className="w-5 h-5" /> Localization
                    </button>
                    <button
                        onClick={() => setActiveTab('ai-rules')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors text-left ${activeTab === 'ai-rules' ? 'bg-white border-2 border-emerald-600 text-emerald-700 shadow-sm' : 'bg-transparent border-2 border-transparent text-neutral-500 hover:bg-neutral-100'}`}
                    >
                        <Zap className="w-5 h-5" /> AI Rules Engine
                    </button>
                    <button
                        onClick={() => setActiveTab('account')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors text-left ${activeTab === 'account' ? 'bg-white border-2 border-emerald-600 text-emerald-700 shadow-sm' : 'bg-transparent border-2 border-transparent text-neutral-500 hover:bg-neutral-100'}`}
                    >
                        <Shield className="w-5 h-5" /> Account & Security
                    </button>
                </div>

                {/* Settings Content Area */}
                <div className="flex-1 space-y-6">
                    {/* Localization Tab */}
                    {activeTab === 'localization' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-sm overflow-hidden">
                                <div className="p-8 border-b border-neutral-100">
                                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">Multi-Currency & Regional</h2>
                                    <p className="text-neutral-500 font-medium">Configure how foreign transactions are converted into your global balance.</p>
                                </div>
                                <div className="p-8 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-sm font-bold text-neutral-700 mb-2">Base / Display Currency</label>
                                            <select title="Base Currency" className="w-full p-4 bg-neutral-50 border-2 border-neutral-100 rounded-xl focus:border-emerald-500 focus:ring-0 outline-none transition-colors font-medium text-neutral-900">
                                                <option value="USD">USD ($) - United States Dollar</option>
                                                <option value="EUR">EUR (€) - Euro</option>
                                                <option value="GBP">GBP (£) - British Pound</option>
                                                <option value="ZAR">ZAR (R) - South African Rand</option>
                                                <option value="NAD">NAD ($) - Namibian Dollar</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-neutral-700 mb-2">Foreign Exchange Rates</label>
                                            <select title="Exchange Rates" className="w-full p-4 bg-neutral-50 border-2 border-neutral-100 rounded-xl focus:border-emerald-500 focus:ring-0 outline-none transition-colors font-medium text-neutral-900">
                                                <option value="live">Live Market Rates (Updated Daily)</option>
                                                <option value="fixed">Manual Fixed Rates</option>
                                                <option value="monthly">Monthly Average Rates</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="border border-emerald-100 bg-emerald-50/50 rounded-2xl p-6">
                                        <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Live Currency Sync Active
                                        </h4>
                                        <p className="text-sm text-emerald-700 font-medium">
                                            Your foreign invoices and receipts are currently being automatically converted to USD based on the real-time exchange rate on the date of the transaction.
                                        </p>
                                    </div>

                                    <hr className="border-neutral-100" />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-sm font-bold text-neutral-700 mb-2">Date Format</label>
                                            <select title="Date Format" className="w-full p-4 bg-neutral-50 border-2 border-neutral-100 rounded-xl focus:border-emerald-500 focus:ring-0 outline-none transition-colors font-medium text-neutral-900">
                                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-neutral-700 mb-2">Number Format</label>
                                            <select title="Number Format" className="w-full p-4 bg-neutral-50 border-2 border-neutral-100 rounded-xl focus:border-emerald-500 focus:ring-0 outline-none transition-colors font-medium text-neutral-900">
                                                <option value="us">1,234,567.89</option>
                                                <option value="eu">1.234.567,89</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* AI Rules Tab */}
                    {activeTab === 'ai-rules' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-sm overflow-hidden">
                                <div className="p-8 border-b border-neutral-100 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Categorization Engine</h2>
                                        <p className="text-neutral-500 font-medium">Train the AI by setting explicit rules for incoming receipts and invoices.</p>
                                    </div>
                                    <button onClick={() => setShowRuleModal(true)} className="flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-neutral-800 transition-colors shadow-sm whitespace-nowrap">
                                        <Plus className="w-4 h-4" /> Add Rule
                                    </button>
                                </div>

                                <div className="divide-y divide-neutral-100">
                                    {rules.map((rule) => (
                                        <div key={rule.id} className="p-8 flex items-start sm:items-center justify-between gap-6 hover:bg-neutral-50 transition-colors group">
                                            <div className="flex-1 space-y-3">
                                                <h4 className="font-bold text-neutral-900 flex items-center gap-2">
                                                    <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                                                    {rule.description}
                                                </h4>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
                                                    <span className="font-mono bg-neutral-100 text-neutral-700 px-3 py-1.5 rounded-lg border border-neutral-200">
                                                        {rule.condition}
                                                    </span>
                                                    <span className="text-neutral-400 font-bold hidden sm:inline">➜</span>
                                                    <span className="font-mono bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100">
                                                        {rule.action}
                                                    </span>
                                                </div>
                                            </div>
                                            <button onClick={() => handleDeleteRule(rule.id)} aria-label="Delete rule" className="p-2 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}

                                    <div className="p-8 bg-neutral-50 text-center">
                                        <p className="text-sm font-bold text-neutral-400">The AI will apply these rules top-to-bottom on all new extractions.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Account Tab */}
                    {activeTab === 'account' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-sm overflow-hidden p-8">
                                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Subscription & Billing</h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div className="border-2 border-neutral-100 p-6 rounded-2xl bg-white hover:border-emerald-200 transition-colors">
                                        <h3 className="font-black text-xl text-neutral-900 mb-1">Starter</h3>
                                        <p className="text-sm font-bold text-neutral-500 mb-4">Good for sole traders</p>
                                        <p className="text-3xl font-black text-neutral-900 mb-6">$29<span className="text-sm text-neutral-400 font-medium">/mo</span></p>
                                        <ul className="space-y-3 mb-6">
                                            <li className="text-sm font-medium text-neutral-600 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Send 20 invoices</li>
                                            <li className="text-sm font-medium text-neutral-600 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Enter 5 bills</li>
                                            <li className="text-sm font-medium text-neutral-600 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Reconcile bank</li>
                                        </ul>
                                        <button className="w-full py-2.5 rounded-xl border-2 border-neutral-200 text-sm font-bold text-neutral-600 hover:bg-neutral-50 transition-colors">Select Plan</button>
                                    </div>

                                    <div className="border-2 border-emerald-500 p-6 rounded-2xl bg-emerald-50/20 relative shadow-sm">
                                        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-bl-xl rounded-tr-xl">Current Plan</div>
                                        <h3 className="font-black text-xl text-emerald-900 mb-1">Standard</h3>
                                        <p className="text-sm font-bold text-emerald-600 mb-4">Good for growing businesses</p>
                                        <p className="text-3xl font-black text-neutral-900 mb-6">$46<span className="text-sm text-neutral-400 font-medium">/mo</span></p>
                                        <ul className="space-y-3 mb-6">
                                            <li className="text-sm font-medium text-neutral-600 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Send unlimited invoices</li>
                                            <li className="text-sm font-medium text-neutral-600 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Enter unlimited bills</li>
                                            <li className="text-sm font-medium text-neutral-600 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Reconcile bank</li>
                                        </ul>
                                        <button className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors">Manage Subscription</button>
                                    </div>

                                    <div className="border-2 border-neutral-100 p-6 rounded-2xl bg-white hover:border-emerald-200 transition-colors">
                                        <h3 className="font-black text-xl text-neutral-900 mb-1">Premium</h3>
                                        <p className="text-sm font-bold text-neutral-500 mb-4">Good for established businesses</p>
                                        <p className="text-3xl font-black text-neutral-900 mb-6">$62<span className="text-sm text-neutral-400 font-medium">/mo</span></p>
                                        <ul className="space-y-3 mb-6">
                                            <li className="text-sm font-medium text-neutral-600 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> All Standard features</li>
                                            <li className="text-sm font-medium text-neutral-600 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Multiple currencies</li>
                                            <li className="text-sm font-medium text-neutral-600 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Analytics & Projections</li>
                                        </ul>
                                        <button className="w-full py-2.5 rounded-xl border-2 border-neutral-200 text-sm font-bold text-neutral-600 hover:bg-neutral-50 transition-colors">Upgrade</button>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                                        <div>
                                            <h4 className="font-bold text-neutral-900">Payment Method</h4>
                                            <p className="text-sm text-neutral-500 mt-1">Visa ending in 4242</p>
                                        </div>
                                        <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">Update</button>
                                    </div>
                                    <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                                        <div>
                                            <h4 className="font-bold text-neutral-900">Data Export</h4>
                                            <p className="text-sm text-neutral-500 mt-1">Download a CSV of your entire ledger history.</p>
                                        </div>
                                        <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors">Export Data</button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-bold text-red-600">Danger Zone</h4>
                                            <p className="text-sm text-neutral-500 mt-1">Permanently delete your account and all data.</p>
                                        </div>
                                        <button className="px-4 py-2 bg-red-50 text-red-700 text-sm font-bold rounded-xl hover:bg-red-100 transition-colors">
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Rule Modal */}
            {showRuleModal && (
                <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-neutral-900">Add AI Rule</h2>
                            <button onClick={() => setShowRuleModal(false)} aria-label="Close" className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddRule} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">Description</label>
                                <input
                                    type="text"
                                    value={newRuleDesc}
                                    onChange={(e) => setNewRuleDesc(e.target.value)}
                                    placeholder="e.g., Software Subs"
                                    className="w-full p-4 bg-neutral-50 border-2 border-neutral-100 rounded-xl focus:border-emerald-500 focus:ring-0 outline-none transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">Condition</label>
                                <input
                                    type="text"
                                    value={newRuleCond}
                                    onChange={(e) => setNewRuleCond(e.target.value)}
                                    placeholder="e.g., If Vendor contains 'Adobe'"
                                    className="w-full p-4 bg-neutral-50 border-2 border-neutral-100 rounded-xl focus:border-emerald-500 focus:ring-0 outline-none transition-colors font-mono text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">Action / Mapping</label>
                                <input
                                    type="text"
                                    value={newRuleAct}
                                    onChange={(e) => setNewRuleAct(e.target.value)}
                                    placeholder="e.g., Assign to 'Software'"
                                    className="w-full p-4 bg-neutral-50 border-2 border-neutral-100 rounded-xl focus:border-emerald-500 focus:ring-0 outline-none transition-colors font-mono text-sm"
                                    required
                                />
                            </div>

                            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-xl font-bold transition-colors shadow-sm mt-4">
                                Save Rule
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
