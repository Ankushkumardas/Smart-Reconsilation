const STORAGE_KEY = "smart_reconciliation_history";

export const saveHistory = (result: any) => {
    try {
        const history = loadHistory();
        const newEntry = {
            date: new Date().toLocaleString(),
            summary: {
                matched: result.matched.length,
                mismatched: result.mismatched.length,
                missingInA: result.missingInA.length,
                missingInB: result.missingInB.length
            },
            result: result,
            id: Date.now()
        };

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
