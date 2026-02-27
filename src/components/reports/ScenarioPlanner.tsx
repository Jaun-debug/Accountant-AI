"use client";

import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { Target, TrendingUp, AlertTriangle, Plus, X, ArrowRight } from 'lucide-react';

interface ScenarioEvent {
    id: number;
    monthIndex: number; // 0 to 5 for next 6 months
    name: string;
    amount: number; // Native impact (negative for expense)
}

const MONTHS = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

const BASELINE_DATA = [
    { month: 'Mar', startingBalance: 124500, projectedIncome: 45000, projectedExpense: -32000 },
    { month: 'Apr', startingBalance: 137500, projectedIncome: 46000, projectedExpense: -33000 },
    { month: 'May', startingBalance: 150500, projectedIncome: 44000, projectedExpense: -32000 },
    { month: 'Jun', startingBalance: 162500, projectedIncome: 48000, projectedExpense: -34000 },
    { month: 'Jul', startingBalance: 176500, projectedIncome: 45000, projectedExpense: -33000 },
    { month: 'Aug', startingBalance: 188500, projectedIncome: 47000, projectedExpense: -32000 },
];

export default function ScenarioPlanner() {
    const [events, setEvents] = useState<ScenarioEvent[]>([]);
    const [showEventModal, setShowEventModal] = useState(false);

    // Form State
    const [newEventName, setNewEventName] = useState('');
    const [newEventAmount, setNewEventAmount] = useState('');
    const [newEventMonth, setNewEventMonth] = useState('0');
    const [newEventType, setNewEventType] = useState<'expense' | 'income'>('expense');

    // Calculate dynamic "What-If" graph data
    const graphData = useMemo(() => {
        let currentBalance = BASELINE_DATA[0].startingBalance;
        let modifiedBalance = BASELINE_DATA[0].startingBalance;

        return BASELINE_DATA.map((data, index) => {
            // Find any scenario events that occur this month or earlier
            const monthEvents = events.filter(e => e.monthIndex === index);
            const eventImpact = monthEvents.reduce((sum, e) => sum + e.amount, 0);

            // Baseline calculation
            const nextBaseBalance = currentBalance + data.projectedIncome + data.projectedExpense;

            // "What-If" calculation
            const nextModBalance = modifiedBalance + data.projectedIncome + data.projectedExpense + eventImpact;

            const point = {
                month: data.month,
                'Baseline Projection': currentBalance,
                'What-If Scenario': modifiedBalance,
                monthlyImpact: eventImpact
            };

            currentBalance = nextBaseBalance;
            modifiedBalance = nextModBalance;

            return point;
        });
    }, [events]);

    const handleAddEvent = (e: React.FormEvent) => {
        e.preventDefault();
        const value = parseInt(newEventAmount.replace(/[^0-9]/g, ''), 10);
        if (!newEventName || isNaN(value)) return;

        const newEvent: ScenarioEvent = {
            id: Date.now(),
            monthIndex: parseInt(newEventMonth, 10),
            name: newEventName,
            amount: newEventType === 'expense' ? -value : value
        };

        setEvents([...events, newEvent]);
        setShowEventModal(false);
        setNewEventName('');
        setNewEventAmount('');
        setNewEventMonth('0');
    };

    const removeEvent = (id: number) => {
        setEvents(events.filter(e => e.id !== id));
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
    };

    const finalBaseline = graphData[5]['Baseline Projection'];
    const finalWhatIf = graphData[5]['What-If Scenario'];
    const difference = finalWhatIf - finalBaseline;

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">Financial Reporting</h1>
                    <p className="text-neutral-500 font-medium mt-1">Multi-currency cash flow statements and "What-If" scenario planning.</p>
                </div>
            </div>

            {/* Scenario Builder Hero */}
            <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-sm overflow-hidden flex flex-col lg:flex-row">
                {/* Controls Sidebar */}
                <div className="w-full lg:w-96 bg-neutral-50 p-6 border-r border-neutral-100 flex flex-col">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2 mb-2">
                            <Target className="w-6 h-6 text-emerald-600" />
                            "What-If" Sandbox
                        </h2>
                        <p className="text-sm text-neutral-500 font-medium">Test major purchases or expected windfalls to see how they affect your baseline 6-month cash runway.</p>
                    </div>

                    <button
                        onClick={() => setShowEventModal(true)}
                        className="w-full bg-white border-2 border-dashed border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 p-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 mb-6"
                    >
                        <Plus className="w-5 h-5" /> Add Test Scenario
                    </button>

                    <div className="flex-1 overflow-y-auto">
                        <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-4">Active Test Variables</h3>
                        {events.length === 0 ? (
                            <div className="text-center p-6 bg-white rounded-xl border border-neutral-100 border-dashed text-neutral-400 text-sm">
                                No test variables active.<br /> You are viewing the baseline projection.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {events.map(event => (
                                    <div key={event.id} className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm relative group">
                                        <button
                                            onClick={() => removeEvent(event.id)}
                                            aria-label="Remove variable"
                                            className="absolute top-2 right-2 p-1 text-neutral-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-neutral-50 rounded-md"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <p className="text-xs font-bold text-emerald-600 mb-1 uppercase tracking-wider">Starts {MONTHS[event.monthIndex]}</p>
                                        <h4 className="font-bold text-neutral-900 truncate pr-6">{event.name}</h4>
                                        <p className={`font-mono mt-1 font-bold ${event.amount > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {event.amount > 0 ? '+' : ''}{formatCurrency(event.amount)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Graph Area */}
                <div className="flex-1 p-6 relative flex flex-col bg-white">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">6-Month Runway projection</p>
                            <div className="flex items-baseline gap-2 mt-1">
                                <h3 className="text-3xl font-black text-neutral-900">{formatCurrency(finalWhatIf)}</h3>
                                <span className={`font-bold ${difference === 0 ? 'text-neutral-400' : difference > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {difference === 0 ? 'Matches Baseline' : difference > 0 ? `+${formatCurrency(difference)} vs Base` : `${formatCurrency(difference)} vs Base`}
                                </span>
                            </div>
                        </div>
                        {difference < 0 && (
                            <div className="bg-red-50 text-red-700 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold border border-red-100">
                                <AlertTriangle className="w-5 h-5" /> High Risk Burn Rate
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={graphData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#A3A3A3', fontWeight: 600 }} dy={10} />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#A3A3A3', fontWeight: 600 }}
                                    tickFormatter={(value) => `$${value / 1000}k`}
                                    dx={-10}
                                />
                                <Tooltip
                                    formatter={(value: any) => formatCurrency(Number(value))}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', fontWeight: 600 }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontWeight: 600 }} />
                                <Line
                                    type="monotone"
                                    dataKey="Baseline Projection"
                                    stroke="#A3A3A3"
                                    strokeWidth={3}
                                    strokeDasharray="5 5"
                                    dot={{ r: 4, fill: '#A3A3A3' }}
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="What-If Scenario"
                                    stroke="#059669"
                                    strokeWidth={4}
                                    dot={{ r: 6, fill: '#059669', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Add Event Modal */}
            {showEventModal && (
                <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-neutral-900">Add Test Variable</h2>
                            <button onClick={() => setShowEventModal(false)} aria-label="Close modal" className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddEvent} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">Variable Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setNewEventType('expense')}
                                        className={`py-3 rounded-xl text-sm font-bold transition-colors border-2 ${newEventType === 'expense' ? 'border-red-600 bg-red-50 text-red-700' : 'border-neutral-100 bg-white text-neutral-500 hover:border-neutral-200'}`}
                                    >
                                        Major Expense
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewEventType('income')}
                                        className={`py-3 rounded-xl text-sm font-bold transition-colors border-2 ${newEventType === 'income' ? 'border-emerald-600 bg-emerald-50 text-emerald-700' : 'border-neutral-100 bg-white text-neutral-500 hover:border-neutral-200'}`}
                                    >
                                        Windfall Income
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">Scenario Name</label>
                                <input
                                    type="text"
                                    value={newEventName}
                                    onChange={(e) => setNewEventName(e.target.value)}
                                    placeholder={newEventType === 'expense' ? "e.g., Hire 2 New Engineers" : "e.g., Series B Funding"}
                                    className="w-full p-4 bg-neutral-50 border-2 border-neutral-100 rounded-xl focus:border-emerald-500 focus:ring-0 outline-none transition-colors font-medium text-neutral-900"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">Impact Amount ($)</label>
                                <input
                                    type="number"
                                    value={newEventAmount}
                                    onChange={(e) => setNewEventAmount(e.target.value)}
                                    placeholder="e.g., 150000"
                                    className="w-full p-4 bg-neutral-50 border-2 border-neutral-100 rounded-xl focus:border-emerald-500 focus:ring-0 outline-none transition-colors font-medium text-neutral-900"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-2">Start Month</label>
                                <select
                                    value={newEventMonth}
                                    onChange={(e) => setNewEventMonth(e.target.value)}
                                    aria-label="Select start month for the variable"
                                    className="w-full p-4 bg-neutral-50 border-2 border-neutral-100 rounded-xl focus:border-emerald-500 focus:ring-0 outline-none transition-colors font-medium text-neutral-900"
                                >
                                    {MONTHS.map((m, i) => (
                                        <option key={i} value={i}>{m} 2026</option>
                                    ))}
                                </select>
                            </div>

                            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-xl font-bold transition-colors shadow-sm mt-4">
                                Apply Variable to Graph
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
