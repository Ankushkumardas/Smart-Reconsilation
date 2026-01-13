// Simple wrapper for LocalStorage (Rule 7)

const STORAGE_KEY = "smart_reconciliation_history";

export const saveHistory = (result: any) => {
    try {
        const history = loadHistory();
        // Add new result to the top
        const newEntry = {
            date: new Date().toLocaleString(),
            summary: {
                matched: result.matched.length,
                mismatched: result.mismatched.length,
                missingInA: result.missingInA.length,
                missingInB: result.missingInB.length
            },
            result: result, // Save full result to reload it
            id: Date.now()
        };

        // Keep only last 10 entries to be safe
        const updatedHistory = [newEntry, ...history].slice(0, 10);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
        console.error("Failed to save history", error);
    }
};

export const loadHistory = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error("Failed to load history", error);
        return [];
    }
};
