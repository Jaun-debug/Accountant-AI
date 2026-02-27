import { FileText } from 'lucide-react';

export default function ClientsPage() {
    return (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center">
            <div className="w-20 h-20 bg-neutral-100 rounded-3xl flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-neutral-300" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900">Client Directory</h1>
            <p className="text-neutral-500 mt-2 max-w-sm">This module is currently being optimized for high-density mobile viewing. Check back soon.</p>
        </div>
    );
}
