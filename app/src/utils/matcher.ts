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

    const mapA = new Map<string, Invoice>();
    fileA.forEach((inv) => mapA.set(inv.invoiceNo, inv));

    const processedInvoiceNumbers = new Set<string>();

    fileB.forEach((invB) => {
        processedInvoiceNumbers.add(invB.invoiceNo);
        const invA = mapA.get(invB.invoiceNo);

        if (invA) {
            const difference = Math.abs(invA.amount - invB.amount);
            if (difference < 0.01) {
                result.matched.push(invA);
            } else {
                result.mismatched.push({ fileA: invA, fileB: invB });
            }
        } else {
            result.missingInA.push(invB);
        }
    });

    fileA.forEach((invA) => {
        if (!processedInvoiceNumbers.has(invA.invoiceNo)) {
            result.missingInB.push(invA);
        }
    });

    return result;
};
