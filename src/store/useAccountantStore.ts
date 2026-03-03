import { create } from 'zustand';

export interface Invoice {
    id: string;
    client: string;
    amount: number;
    status: 'Paid' | 'Pending' | 'Overdue' | 'Draft';
    date: string;
    dueDate: string;
}

interface Transaction {
    date: string;
    description: string;
    amount: number;
    account?: string;
    approved?: boolean;
}

interface ExtractionResults {
    listName: string;
    transactions: Transaction[];
}

interface Statement {
    id: string;
    month: string;
    size: string;
    status: string;
}

interface ClientFile {
    name: string;
    displayName: string;
    total: string;
    companies: string[];
    created: string;
}

interface Client {
    name: string;
    debits: ClientFile[];
    credits: ClientFile[];
}

interface AccountantStore {
    activeTab: string;
    setActiveTab: (tab: string) => void;

    statements: Statement[];
    setStatements: (statements: Statement[]) => void;
    loadingStatements: boolean;
    setLoadingStatements: (loading: boolean) => void;

    clients: Client[];
    setClients: (clients: Client[]) => void;

    extractionResults: ExtractionResults | null;
    setExtractionResults: (results: ExtractionResults | null) => void;

    isExtracting: boolean;
    setIsExtracting: (is: boolean) => void;

    viewingFile: any;
    setViewingFile: (file: any) => void;

    expandedSections: Record<string, boolean>;
    toggleSection: (clientName: string, type: string) => void;

    invoices: Invoice[];
    setInvoices: (invoices: Invoice[]) => void;
    addInvoice: (invoice: Invoice) => void;
    updateInvoiceStatus: (id: string, status: Invoice['status']) => void;
    deleteInvoice: (id: string) => void;
}

export const useAccountantStore = create<AccountantStore>((set) => ({
    activeTab: 'overview',
    setActiveTab: (tab) => set({ activeTab: tab }),

    statements: [],
    setStatements: (statements) => set({ statements }),
    loadingStatements: false,
    setLoadingStatements: (loading) => set({ loadingStatements: loading }),

    clients: [],
    setClients: (clients) => set({ clients }),

    extractionResults: null,
    setExtractionResults: (results) => set({ extractionResults: results }),

    isExtracting: false,
    setIsExtracting: (is) => set({ isExtracting: is }),

    viewingFile: null,
    setViewingFile: (file) => set({ viewingFile: file }),

    expandedSections: {},
    toggleSection: (clientName, type) => set((state) => {
        const key = `${clientName}-${type}`;
        return {
            expandedSections: {
                ...state.expandedSections,
                [key]: !state.expandedSections[key]
            }
        };
    }),

    invoices: [
        { id: 'INV-2026-001', client: 'Acme Corp', amount: 4500.00, status: 'Paid', date: 'Feb 12, 2026', dueDate: 'Feb 26, 2026' },
        { id: 'INV-2026-002', client: 'TechFlow', amount: 8200.00, status: 'Pending', date: 'Feb 18, 2026', dueDate: 'Mar 04, 2026' },
        { id: 'INV-2026-003', client: 'Global Dynamics', amount: 2100.00, status: 'Overdue', date: 'Jan 25, 2026', dueDate: 'Feb 08, 2026' },
    ],
    setInvoices: (invoices) => set({ invoices }),
    addInvoice: (invoice) => set((state) => ({ invoices: [invoice, ...state.invoices] })),
    updateInvoiceStatus: (id, status) => set((state) => ({
        invoices: state.invoices.map(inv => inv.id === id ? { ...inv, status } : inv)
    })),
    deleteInvoice: (id) => set((state) => ({
        invoices: state.invoices.filter(inv => inv.id !== id)
    })),
}));
