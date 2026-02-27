"use client";

import React, { useMemo } from 'react';
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
import { useAccountantStore } from '@/store/useAccountantStore';
import { cn } from '@/lib/utils';

export default function DashboardOverview() {
    const { clients } = useAccountantStore();

    const formatAmount = (num: number) => {
        return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true });
    };

    const dashboardStats = useMemo(() => {
        let globalRevenue = 0;
        let globalExpenses = 0;
        let fileCount = 0;

        clients.forEach(c => {
            c.credits?.forEach(f => {
                globalRevenue += parseFloat(f.total.toString().replace(/,/g, '') || "0");
                fileCount++;
            });
            c.debits?.forEach(f => {
                globalExpenses += parseFloat(f.total.toString().replace(/,/g, '') || "0");
                fileCount++;
            });
        });

        const activeClients = clients.length;
        const globalBalance = globalRevenue - globalExpenses;

        return {
            globalBalance,
            globalRevenue,
            activeClients,
            fileCount
        };
    }, [clients]);

    const stats = [
        {
            name: 'Total Revenue',
            value: `N$${formatAmount(dashboardStats.globalRevenue)}`,
            change: '+0.0%',
            trend: 'up',
            icon: TrendingUp,
            color: 'emerald'
        },
        {
            name: 'Active Clients',
            value: dashboardStats.activeClients.toString(),
            change: 'New',
            trend: 'up',
            icon: Users,
            color: 'blue'
        },
        {
            name: 'Saved Statements',
            value: dashboardStats.fileCount.toString(),
            change: 'Archive',
            trend: 'up',
            icon: History,
            color: 'amber'
        },
        {
            name: 'AI Processed',
            value: '0',
            change: 'Automated',
            trend: 'up',
            icon: Zap,
            color: 'purple'
        },
    ];

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl lg:text-5xl font-serif text-neutral-900 tracking-tight">Earning Dashboard</h1>
                    <p className="text-neutral-500 font-light mt-2 tracking-wide">Welcome back. Here is the latest intelligent summary.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-1">Global Balance</p>
                        <p className="text-3xl lg:text-4xl font-serif text-neutral-900 tracking-tight">N${formatAmount(dashboardStats.globalBalance)}</p>
                    </div>
                    <div className="w-14 h-14 bg-emerald-600 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                        <TrendingUp className="w-7 h-7" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm hover:shadow-2xl hover:shadow-neutral-200/50 transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                                stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                                    stat.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                                        'bg-purple-50 text-purple-600'
                                }`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className={cn(
                                "flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest",
                                stat.trend === 'up' ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                            )}>
                                {stat.change}
                            </div>
                        </div>
                        <h3 className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest">{stat.name}</h3>
                        <p className="text-3xl lg:text-4xl font-serif text-neutral-900 mt-2 tracking-tight">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl lg:text-4xl font-serif text-neutral-900 tracking-tight flex items-center gap-4">
                        <Folder className="w-8 h-8 text-emerald-600" />
                        Client Repository
                    </h2>
                    <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-[0.2em] px-6 py-3 bg-emerald-50/80 hover:bg-emerald-100 rounded-2xl">View All</button>
                </div>
                <ClientRepository />
            </div>
        </div>
    );
}
