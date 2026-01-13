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
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm shrink-0">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 pb-3 border-b border-slate-200">
                Upload Files
            </h2>
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-slate-800 mb-2">File A (CSV/Excel)</label>
                    <input
                        type="file"
                        accept=".csv, .xlsx, .xls"
                        className="text-sm p-2 border border-slate-200 rounded bg-slate-50 cursor-pointer file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 w-full"
                        onChange={(e) => setFileA(e.target.files ? e.target.files[0] : null)}
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-slate-800 mb-2">File B (CSV/Excel)</label>
                    <input
                        type="file"
                        accept=".csv, .xlsx, .xls"
                        className="text-sm p-2 border border-slate-200 rounded bg-slate-50 cursor-pointer file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 w-full"
                        onChange={(e) => setFileB(e.target.files ? e.target.files[0] : null)}
                    />
                </div>
            </div>

            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

            <button
                onClick={handleProcess}
                disabled={loading}
                className="bg-slate-900 text-white px-5 py-2.5 rounded text-sm font-medium hover:opacity-90 transition-opacity disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
                {loading ? "Processing..." : "Reconcile Files"}
            </button>
        </div>
    );
};

export default FileUpload;
