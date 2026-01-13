import React, { useState } from "react";
import type { ComparisonResult } from "../utils/matcher";

interface Props {
    results: ComparisonResult;
}

const ReconciliationTable: React.FC<Props> = ({ results }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filterBySearch = (item: any) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        if (item.invoiceNo?.toLowerCase().includes(term)) return true;
        if (item.fileA?.invoiceNo?.toLowerCase().includes(term)) return true;
        if (item.fileB?.invoiceNo?.toLowerCase().includes(term)) return true;
        return false;
    };

    return (
        <div className="card">
            <h2>Reconciliation Results</h2>

            <div className="summary">
                <div className="summary-item success">
                    <span className="summary-label">Matched</span>
                    <span className="summary-count">{results.matched.length}</span>
                </div>
                <div className="summary-item error">
                    <span className="summary-label">Mismatched</span>
                    <span className="summary-count">{results.mismatched.length}</span>
                </div>
                <div className="summary-item warning">
                    <span className="summary-label">Missing in A</span>
                    <span className="summary-count">{results.missingInA.length}</span>
                </div>
                <div className="summary-item warning">
                    <span className="summary-label">Missing in B</span>
                    <span className="summary-count">{results.missingInB.length}</span>
                </div>
            </div>

            <div style={{ marginTop: "10px", marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Search by Invoice No..."
                    value={searchTerm}
                    className="search-input"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

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
                    <div className="table-container">
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
                </div>
            )}

            {results.missingInA.length > 0 && (
                <div className="section">
                    <h3>Missing in File A (Exists in B only)</h3>
                    <div className="table-container">
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
                </div>
            )}

            <div className="section">
                <h3>Matched Records (Preview)</h3>
                <p style={{ marginBottom: '10px', color: '#666', fontSize: '0.9em' }}>Showing first 10 matched records...</p>
                <div className="table-container">
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

        </div>
    );
};

export default ReconciliationTable;
