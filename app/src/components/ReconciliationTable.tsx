import React, { useState, useMemo } from "react";
import type { ComparisonResult } from "../utils/matcher";

interface Props {
    results: ComparisonResult;
}

type Status = "Matched" | "Mismatched" | "Missing in A" | "Missing in B";
type SortField = "invoiceNo" | "date" | "amountA" | "amountB" | "difference" | "status";
type SortOrder = "asc" | "desc";

interface TableRow {
    id: string;
    invoiceNo: string;
    amountA: number | null;
    amountB: number | null;
    difference: number | null;
    date: string;
    status: Status;
}

const ReconciliationTable: React.FC<Props> = ({ results }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [sortField, setSortField] = useState<SortField>("invoiceNo");
    const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const unifiedData: TableRow[] = useMemo(() => {
        const rows: TableRow[] = [];

        results.mismatched.forEach((item, idx) => {
            rows.push({
                id: `mis-${idx}`,
                invoiceNo: item.fileA.invoiceNo,
                amountA: item.fileA.amount,
                amountB: item.fileB.amount,
                difference: item.fileA.amount - item.fileB.amount,
                date: item.fileA.date || item.fileB.date,
                status: "Mismatched"
            });
        });

        results.missingInB.forEach((item, idx) => {
            rows.push({
                id: `misB-${idx}`,
                invoiceNo: item.invoiceNo,
                amountA: item.amount,
                amountB: null,
                difference: null,
                date: item.date,
                status: "Missing in B"
            });
        });

        results.missingInA.forEach((item, idx) => {
            rows.push({
                id: `misA-${idx}`,
                invoiceNo: item.invoiceNo,
                amountA: null,
                amountB: item.amount,
                difference: null,
                date: item.date,
                status: "Missing in A"
            });
        });

        results.matched.forEach((item, idx) => {
            rows.push({
                id: `mat-${idx}`,
                invoiceNo: item.invoiceNo,
                amountA: item.amount,
                amountB: item.amount,
                difference: 0,
                date: item.date,
                status: "Matched"
            });
        });

        return rows;
    }, [results]);

    const processedData = useMemo(() => {
        let data = unifiedData.filter(row => {
            const matchesSearch = row.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "All" || row.status === statusFilter;
            return matchesSearch && matchesStatus;
        });

        data.sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];

            if (aValue === null && bValue === null) return 0;
            if (aValue === null) return 1;
            if (bValue === null) return -1;

            if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
            if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

        return data;
    }, [unifiedData, searchTerm, statusFilter, sortField, sortOrder]);

    const totalPages = Math.ceil(processedData.length / itemsPerPage);
    const paginatedData = processedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const getStatusBadgeClass = (status: Status) => {
        const base = "inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold leading-none whitespace-nowrap";
        switch (status) {
            case "Matched": return `${base} bg-green-100 text-green-800`;
            case "Mismatched": return `${base} bg-red-100 text-red-800`;
            case "Missing in A": return `${base} bg-amber-100 text-amber-800`;
            case "Missing in B": return `${base} bg-amber-100 text-amber-800`;
            default: return base;
        }
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return <span className="opacity-30 ml-1.5">↕</span>;
        return <span className="ml-1.5">{sortOrder === "asc" ? "↑" : "↓"}</span>;
    };

    return (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col flex-1 h-full min-h-[500px]">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800 m-0">Reconciliation Results</h2>
                <div className="text-sm text-slate-500">
                    Total Records: <strong>{unifiedData.length}</strong>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-md flex flex-col bg-white shadow-sm ring-1 ring-slate-100">
                    <span className="text-xs uppercase font-semibold text-slate-500 mb-1">Matched</span>
                    <span className="text-2xl font-bold text-slate-800">{results.matched.length}</span>
                </div>
                <div className="p-4 rounded-md flex flex-col bg-white shadow-sm ring-1 ring-slate-100">
                    <span className="text-xs uppercase font-semibold text-slate-500 mb-1">Mismatched</span>
                    <span className="text-2xl font-bold text-slate-800">{results.mismatched.length}</span>
                </div>
                <div className="p-4 rounded-md flex flex-col bg-white shadow-sm ring-1 ring-slate-100">
                    <span className="text-xs uppercase font-semibold text-slate-500 mb-1">Missing in A</span>
                    <span className="text-2xl font-bold text-slate-800">{results.missingInA.length}</span>
                </div>
                <div className="p-4 rounded-md flex flex-col bg-white shadow-sm ring-1 ring-slate-100">
                    <span className="text-xs uppercase font-semibold text-slate-500 mb-1">Missing in B</span>
                    <span className="text-2xl font-bold text-slate-800">{results.missingInB.length}</span>
                </div>
            </div>

            <div className="flex gap-4 mb-4 flex-wrap">
                <input
                    type="text"
                    placeholder="Search Invoice No..."
                    value={searchTerm}
                    className="flex-1 min-w-[200px] px-4 py-2.5 border border-slate-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                    className="px-4 py-2.5 bg-white border border-slate-200 rounded text-sm min-w-[150px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="All">All Statuses</option>
                    <option value="Mismatched">Mismatched (Errors)</option>
                    <option value="Missing in B">Missing in B</option>
                    <option value="Missing in A">Missing in A</option>
                    <option value="Matched">Matched</option>
                </select>
            </div>

            <div className="flex-1 overflow-y-auto border border-slate-200 rounded bg-white">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-xs sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th onClick={() => handleSort("invoiceNo")} className="px-4 py-3 border-b border-slate-200 cursor-pointer hover:bg-slate-100 whitespace-nowrap">Invoice No <SortIcon field="invoiceNo" /></th>
                            <th onClick={() => handleSort("date")} className="px-4 py-3 border-b border-slate-200 cursor-pointer hover:bg-slate-100 whitespace-nowrap">Date <SortIcon field="date" /></th>
                            <th onClick={() => handleSort("amountA")} className="px-4 py-3 border-b border-slate-200 cursor-pointer hover:bg-slate-100 whitespace-nowrap">Amount (A) <SortIcon field="amountA" /></th>
                            <th onClick={() => handleSort("amountB")} className="px-4 py-3 border-b border-slate-200 cursor-pointer hover:bg-slate-100 whitespace-nowrap">Amount (B) <SortIcon field="amountB" /></th>
                            <th onClick={() => handleSort("difference")} className="px-4 py-3 border-b border-slate-200 cursor-pointer hover:bg-slate-100 whitespace-nowrap">Diff <SortIcon field="difference" /></th>
                            <th onClick={() => handleSort("status")} className="px-4 py-3 border-b border-slate-200 cursor-pointer hover:bg-slate-100 whitespace-nowrap">Status <SortIcon field="status" /></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {paginatedData.length > 0 ? (
                            paginatedData.map((row) => (
                                <tr key={row.id} className="hover:bg-slate-50 even:bg-slate-50/50">
                                    <td className="px-4 py-3 font-medium text-slate-900">{row.invoiceNo}</td>
                                    <td className="px-4 py-3 text-slate-500">{row.date || '-'}</td>
                                    <td className="px-4 py-3 text-slate-700 tabular-nums">{row.amountA !== null ? Number(row.amountA).toFixed(2) : '-'}</td>
                                    <td className="px-4 py-3 text-slate-700 tabular-nums">{row.amountB !== null ? Number(row.amountB).toFixed(2) : '-'}</td>
                                    <td className={`px-4 py-3 tabular-nums ${row.difference && Math.abs(row.difference) > 0 ? 'text-red-700 font-semibold' : 'text-slate-700'}`}>
                                        {row.difference !== null && row.difference !== 0 ? Number(row.difference).toFixed(2) : '-'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={getStatusBadgeClass(row.status)}>
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-12 text-slate-500 italic">
                                    No records found matching your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 border border-slate-200 bg-white rounded text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-slate-500">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 border border-slate-200 bg-white rounded text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReconciliationTable;
