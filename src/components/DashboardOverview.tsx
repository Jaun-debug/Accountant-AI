"use client";

import React from 'react';
import {
    TrendingUp,
    Users,
    History,
    Zap,
    ArrowUpRight,
    ArrowDownRight,
    Folder
} from 'lucide-react';
import ClientRepository from '@/components/ClientRepository';
import { cn } from '@/lib/utils';

const stats = [
    {
        name: 'Total Revenue',
        value: '$124,500',
        change: '+12.5%',
        trend: 'up',
        icon: TrendingUp,
        color: 'emerald'
    },
    {
        name: 'Active Clients',
        value: '48',
        change: '+3',
        trend: 'up',
        icon: Users,
        color: 'blue'
    },
    {
        name: 'Saved Statements',
        value: '156',
        change: '+8',
        trend: 'up',
        icon: History,
        color: 'amber'
    },
    {
        name: 'AI Processed',
        value: '1,240',
        change: '+142',
        trend: 'up',
        icon: Zap,
        color: 'purple'
    },
];

export default function DashboardOverview() {
    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">Earning Dashboard</h1>
                    <p className="text-neutral-500 font-medium mt-1">Welcome back, John! Here&apos;s what&apos;s happening with your clients today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Global Balance</p>
                        <p className="text-2xl font-black text-neutral-900">$45,280.00</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-xl hover:shadow-neutral-200/40 transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                                    stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                                        stat.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                                            'bg-purple-50 text-purple-600'
                                }`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider",
                                stat.trend === 'up' ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                            )}>
                                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {stat.change}
                            </div>
                        </div>
                        <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">{stat.name}</h3>
                        <p className="text-3xl font-black text-neutral-900 mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-neutral-900 tracking-tight flex items-center gap-3">
                        <Folder className="w-7 h-7 text-emerald-600" />
                        Client Repository
                    </h2>
                    <button className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-widest px-4 py-2 bg-emerald-50 rounded-xl">View All</button>
                </div>
                <ClientRepository />
            </div>
        </div>
    );
}
