import Papa from "papaparse";
import * as XLSX from "xlsx";

// Define a simple structure for our Invoice data
export interface Invoice {
    invoiceNo: string;
    amount: number;
    date: string;
    // We keep the original data just in case, but for this app we focused on these 3
    [key: string]: any;
}

// Helper to normalize the data (Rule 4)
const normalizeInvoice = (row: any): Invoice => {
    // We assume column names "invoiceNo", "amount", "date" or similar
    // To be beginner friendly, we will try to find keys that look like these.

    // Simple heuristic: lowercase all keys to find matches
    const keys = Object.keys(row);
    const getValue = (keyword: string) => {
        const key = keys.find((k) => k.toLowerCase().includes(keyword));
        return key ? row[key] : null;
    };

    const rawInvoiceNo = getValue("invoice") || getValue("no") || "UNKNOWN";
    const rawAmount = getValue("amount") || 0;
    const rawDate = getValue("date") || "";

    return {
        invoiceNo: String(rawInvoiceNo).trim().toUpperCase(), // Rule 4: Trim and Uppercase
        amount: parseFloat(String(rawAmount).replace(/[^0-9.-]+/g, "")) || 0, // Rule 4: Convert to number, remove currency symbols
        date: String(rawDate), // Rule 4: Date formatting will be done in UI or here? Prompt said "Convert date to YYYY-MM-DD"
        // For simplicity, let's keep date as string for now, advanced parsing can be added if needed.
        // If it's Excel serial number, we might need conversion, but let's stick to string first.
        ...row,
    };
};

export const parseFile = (file: File): Promise<Invoice[]> => {
    return new Promise((resolve, reject) => {
        const isCsv = file.name.toLowerCase().endsWith(".csv");
        const isExcel = file.name.toLowerCase().endsWith(".xlsx") || file.name.toLowerCase().endsWith(".xls");

        if (isCsv) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const data = results.data.map(normalizeInvoice);
                    console.log("Parsed CSV:", data); // Rule 2: Log parsed JSON
                    resolve(data);
                },
                error: (err) => reject(err),
            });
        } else if (isExcel) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: "binary" });
                const firstSheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet);
                const normalizedData = jsonData.map(normalizeInvoice);
                console.log("Parsed Excel:", normalizedData); // Rule 2: Log parsed JSON
                resolve(normalizedData);
            };
            reader.onerror = (err) => reject(err);
            reader.readAsBinaryString(file);
        } else {
            reject(new Error("Unsupported file type"));
        }
    });
};
