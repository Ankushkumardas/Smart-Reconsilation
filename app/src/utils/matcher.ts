import type { Invoice } from "./parser";

export interface ComparisonResult {
    matched: Invoice[];
    mismatched: { fileA: Invoice; fileB: Invoice }[];
    missingInA: Invoice[];
    missingInB: Invoice[];
}

export const reconcileFiles = (fileA: Invoice[], fileB: Invoice[]): ComparisonResult => {
    const result: ComparisonResult = {
        matched: [],
        mismatched: [],
        missingInA: [],
        missingInB: [],
    };

    // Create a map for File A for easy lookup
    // Map<InvoiceNumber, InvoiceObject>
    const mapA = new Map<string, Invoice>();
    fileA.forEach((inv) => mapA.set(inv.invoiceNo, inv));

    // Iterate through File B to find matches and missing in A
    const processedInvoiceNumbers = new Set<string>();

    fileB.forEach((invB) => {
        processedInvoiceNumbers.add(invB.invoiceNo);
        const invA = mapA.get(invB.invoiceNo);

        if (invA) {
            // Rule 5: If exists in both -> check amount
            // We use a small epsilon for float comparison safety or just direct comparison
            const difference = Math.abs(invA.amount - invB.amount);
            if (difference < 0.01) {
                // Matched
                result.matched.push(invA);
            } else {
                // Mismatched
                result.mismatched.push({ fileA: invA, fileB: invB });
            }
        } else {
            // Exists in B but not in A -> Missing in First (File A)
            result.missingInA.push(invB);
        }
    });

    // Check for items in File A that were not in File B
    fileA.forEach((invA) => {
        if (!processedInvoiceNumbers.has(invA.invoiceNo)) {
            // Exists in A but not in B -> Missing in Second (File B)
            result.missingInB.push(invA);
        }
    });

    return result;
};
