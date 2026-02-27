import { create } from 'zustand';

interface Transaction {
    date: string;
    description: string;
    amount: number;
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
}));
