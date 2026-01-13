import Papa from "papaparse";
import * as XLSX from "xlsx";

export interface Invoice {
    invoiceNo: string;
    amount: number;
    date: string;
    [key: string]: any;
}

const normalizeInvoice = (row: any): Invoice => {
    const keys = Object.keys(row);
    const getValue = (keyword: string) => {
        const key = keys.find((k) => k.toLowerCase().includes(keyword));
        return key ? row[key] : null;
    };

    const rawInvoiceNo = getValue("invoice") || getValue("no") || "UNKNOWN";
    const rawAmount = getValue("amount") || 0;
    const rawDate = getValue("date") || "";

    return {
        invoiceNo: String(rawInvoiceNo).trim().toUpperCase(),
        amount: parseFloat(String(rawAmount).replace(/[^0-9.-]+/g, "")) || 0,
        date: String(rawDate),
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
                    console.log("Parsed CSV:", data);
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
                console.log("Parsed Excel:", normalizedData);
                resolve(normalizedData);
            };
            reader.onerror = (err) => reject(err);
            reader.readAsBinaryString(file);
        } else {
            reject(new Error("Unsupported file type"));
        }
    });
};
