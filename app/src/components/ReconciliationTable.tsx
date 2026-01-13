import React, { useState } from "react";
import type { ComparisonResult } from "../utils/matcher"; // Import type

interface Props {
    results: ComparisonResult;
}

const ReconciliationTable: React.FC<Props> = ({ results }) => {
    const [searchTerm, setSearchTerm] = useState("");

    // Simple search filter (Rule 6)
    const filterBySearch = (item: any) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        // Check invoiceNo or amount
        if (item.invoiceNo?.toLowerCase().includes(term)) return true;
        if (item.fileA?.invoiceNo?.toLowerCase().includes(term)) return true;
        if (item.fileB?.invoiceNo?.toLowerCase().includes(term)) return true;
        return false;
    };

    return (
        <div className="card">
            <h2>2. Reconciliation Results</h2>

            {/* Summary Counts (Rule 6) */}
            <div className="summary">
                <div className="summary-item success">Matched: {results.matched.length}</div>
                <div className="summary-item error">Mismatched: {results.mismatched.length}</div>
                <div className="summary-item warning">Missing in A: {results.missingInA.length}</div>
                <div className="summary-item warning">Missing in B: {results.missingInB.length}</div>
            </div>

            <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                <input
                    type="text"
                    placeholder="Search by Invoice No..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: "5px", width: "100%", maxWidth: "300px" }}
                />
            </div>

            {/* Tables for each category */}
            {results.mismatched.length > 0 && (
                <div className="section">
                    <h3>Mismatched Records (Amount Differs)</h3>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Invoice No</th>
                                    <th>Amount File A</th>
                                    <th>Amount File B</th>
                                    <th>Difference</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.mismatched.filter(filterBySearch).map((item, idx) => (
                                    <tr key={idx} className="row-error">
                                        <td>{item.fileA.invoiceNo}</td>
                                        <td>{item.fileA.amount}</td>
                                        <td>{item.fileB.amount}</td>
                                        <td>{(item.fileA.amount - item.fileB.amount).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {results.missingInB.length > 0 && (
                <div className="section">
                    <h3>Missing in File B (Exists in A only)</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Invoice No</th>
                                <th>Amount</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.missingInB.filter(filterBySearch).map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.invoiceNo}</td>
                                    <td>{item.amount}</td>
                                    <td>{item.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {results.missingInA.length > 0 && (
                <div className="section">
                    <h3>Missing in File A (Exists in B only)</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Invoice No</th>
                                <th>Amount</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.missingInA.filter(filterBySearch).map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.invoiceNo}</td>
                                    <td>{item.amount}</td>
                                    <td>{item.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Show matched only if requested or simple list, maybe too long for big files? 
          Let's show a small preview or just count for simplicity as beginners often just want errors.
          But user said "Display results", usually errors are most important. 
          I'll add a toggle effectively or just list commonly. 
          Let's just list errors/missing above. Matched can be just a count or separate view if needed.
          For this beginner app, let's keep it simple: Show errors/missing prominently. 
      */}
            <div className="section">
                <h3>Matched Records (Preview)</h3>
                <p>Showing first 10 matched records...</p>
                <table>
                    <thead>
                        <tr>
                            <th>Invoice No</th>
                            <th>Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.matched.filter(filterBySearch).slice(0, 10).map((item, idx) => (
                            <tr key={idx} className="row-success">
                                <td>{item.invoiceNo}</td>
                                <td>{item.amount}</td>
                                <td>{item.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default ReconciliationTable;
