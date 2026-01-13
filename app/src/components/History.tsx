import React, { useEffect, useState } from "react";
import { loadHistory } from "../utils/storage";

interface Props {
    onLoadHistory: (result: any) => void;
}

const History: React.FC<Props> = ({ onLoadHistory }) => {
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        setHistory(loadHistory());
    }, []);

    if (history.length === 0) {
        return (
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-800 mb-4 pb-3 border-b border-slate-200">History</h2>
                <div className="text-center py-8 text-slate-500 italic">No history available yet.</div>
            </div>
        )
    }

    return (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 pb-3 border-b border-slate-200">History</h2>
            <ul className="flex flex-col divide-y divide-slate-100">
                {history.map((item) => (
                    <li key={item.id} className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
                        <div>
                            <strong className="block text-slate-900 text-sm mb-1">{item.date}</strong>
                            <span className="text-xs text-slate-500">Matches: {item.summary.matched} • Mismatches: {item.summary.mismatched}</span>
                        </div>
                        <button
                            onClick={() => onLoadHistory(item.result)}
                            className="px-3 py-1.5 border border-slate-200 bg-white rounded text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-500 transition-colors"
                        >
                            Load
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default History;
