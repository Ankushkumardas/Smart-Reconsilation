import React, { useEffect, useState } from "react";
import { loadHistory } from "../utils/storage";

interface Props {
    onLoadHistory: (result: any) => void;
}

const History: React.FC<Props> = ({ onLoadHistory }) => {
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        setHistory(loadHistory());
    }, []); // Load once on mount

    // Helper to reload if new item added - handled by lifting state or just refresh button
    // For simplicity, we just load on mount.

    if (history.length === 0) {
        return (
            <div className="card">
                <h2>History</h2>
                <p>No history yet.</p>
            </div>
        )
    }

    return (
        <div className="card">
            <h2>History</h2>
            <ul>
                {history.map((item) => (
                    <li key={item.id} style={{ marginBottom: "10px", borderBottom: "1px solid #ccc", paddingBottom: "5px" }}>
                        <strong>{item.date}</strong> <br />
                        <span>Matched: {item.summary.matched} | Mismatched: {item.summary.mismatched}</span> <br />
                        {/* Ideally we would store the full result to view it, but storage might get full.
                In utils/storage.js I only stored summary. 
                Wait, the prompt says "Allow user to click and view previous reconciliation results".
                If I only stored summary, I can't view details. 
                I should update storage.ts to store full result if possible, or warn user.
                For beginner app size, storing full result in localstorage is risky if files are huge.
                But let's assume small files for this demo.
                I will ignore this for a second and assume the user just wants to see the summary or I need to fix storage.
                
                Actually, let's fix storage.ts in the next step or right now?
                The previous `storage.ts` implementation:
                `const newEntry = { ..., summary: {...}, id: ... };` 
                It missed the actual `result` data payload needed for `onLoadHistory`.
                
                I should fix `History.tsx` to handle what we have, AND I must fix `storage.ts` to save the data.
                
                For now I will write this History component assuming `item.result` exists (I will fix storage.ts next).
            */}
                        <button onClick={() => onLoadHistory(item.result)} style={{ fontSize: "0.8em" }}>
                            Load This Result
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default History;
