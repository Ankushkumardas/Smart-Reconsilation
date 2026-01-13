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
            <div className="card">
                <h2>History</h2>
                <div className="empty-state">No history available yet.</div>
            </div>
        )
    }

    return (
        <div className="card">
            <h2>History</h2>
            <ul className="history-list">
                {history.map((item) => (
                    <li key={item.id} className="history-item">
                        <div className="history-info">
                            <strong>{item.date}</strong>
                            <span>Matches: {item.summary.matched} • Mismatches: {item.summary.mismatched}</span>
                        </div>
                        <button onClick={() => onLoadHistory(item.result)} className="btn-secondary">
                            Load
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default History;
