import React, { useState } from "react";
import { parseFile, type Invoice } from "../utils/parser";

interface FileUploadProps {
    onProcess: (fileAData: Invoice[], fileBData: Invoice[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onProcess }) => {
    const [fileA, setFileA] = useState<File | null>(null);
    const [fileB, setFileB] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleProcess = async () => {
        if (!fileA || !fileB) {
            setError("Please select both files.");
            return;
        }
        setError("");
        setLoading(true);

        try {
            console.log("Processing files...");
            const dataA = await parseFile(fileA);
            const dataB = await parseFile(fileB);

            onProcess(dataA, dataB);
        } catch (err: any) {
            console.error(err);
            setError("Error parsing files: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h2>Upload Files</h2>
            <div className="upload-container">
                <div className="file-input">
                    <label>File A (CSV/Excel)</label>
                    <input
                        type="file"
                        accept=".csv, .xlsx, .xls"
                        onChange={(e) => setFileA(e.target.files ? e.target.files[0] : null)}
                    />
                </div>
                <div className="file-input">
                    <label>File B (CSV/Excel)</label>
                    <input
                        type="file"
                        accept=".csv, .xlsx, .xls"
                        onChange={(e) => setFileB(e.target.files ? e.target.files[0] : null)}
                    />
                </div>
            </div>

            {error && <p style={{ color: "var(--error)", marginBottom: "10px" }}>{error}</p>}

            <button onClick={handleProcess} disabled={loading} className="action-btn">
                {loading ? "Processing..." : "Reconcile Files"}
            </button>
        </div>
    );
};

export default FileUpload;
