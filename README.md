# Smart Reconciliation Visualizer

Welcome to the **Smart Reconciliation Visualizer**! This is a simple tool designed to help you compare two invoice files (like Excel or CSV) and see what matches, what doesn't, and what is missing.

## What Does This App Do?

Imagine you have two lists of invoices (File A and File B). You want to know:
1.  **Matched**: Which invoices are exactly the same in both files?
2.  **Mismatched**: Which invoices have the same number but different amounts?
3.  **Missing**: Which invoices are in File A but not File B (and vice versa)?

This app does all that for you instantly!

---

## How to Run the App

1.  **Install Dependencies** (First time only):
    Open your terminal in this folder and run:
    ```bash
    npm install
    ```

2.  **Start the App**:
    Run this command to start the website:
    ```bash
    npm run dev
    ```

3.  **Open in Browser**:
    Click the link shown in the terminal (usually `http://localhost:5173`) to see the app.

---

## How to Use It

1.  **Upload Files**:
    -   On the left sidebar, you will see "Upload Files".
    -   Click "Choose File" for **File A** and **File B**.
    -   Click the **"Reconcile Files"** button.

2.  **View Results**:
    -   The main dashboard will show you a summary (Matched vs Mismatched).
    -   A big table will list all the invoices.
    -   **Green Badge**: Everything is good!
    -   **Red Badge**: The amounts don't match.
    -   **Yellow Badge**: The invoice is missing in one of the files.

3.  **Filter & Search**:
    -   Use the search bar to find a specific Invoice Number.
    -   Use the dropdown to see only "Mismatched" or "Missing" items.

---

## Project Structure (For Developers)

If you want to look at the code, here is how it is organized:

-   **`src/App.tsx`**: The main file that sets up the layout (Sidebar + Main Content).
-   **`src/components/`**: The detailed building blocks:
    -   `FileUpload.tsx`: Handles picking files.
    -   `ReconciliationTable.tsx`: The big table that shows results.
    -   `History.tsx`: Saves your past checks so you don't lose them.
-   **`src/utils/`**: The logic "brain" of the app:
    -   `parser.ts`: Reads Excel/CSV files and understands them.
    -   `matcher.ts`: Compares the two files to find differences.
    -   `storage.ts`: Saves history to your browser.
-   **`src/index.css`**: The styling settings (using Tailwind CSS for design).

---

## Technologies Used

-   **React**: To build the user interface.
-   **Tailwind CSS**: To make it look professional and clean.
-   **SheetJS & PapaParse**: To read Excel and CSV files.

Enjoy using the Smart Reconciliation Visualizer!
