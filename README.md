# 📊 Smart Reconciliation Visualizer

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-Active-success.svg)

**A professional tool to reconcile, compare, and visualize invoice datasets instantly.**

[View Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## 🚀 Overview

**Smart Reconciliation Visualizer** is a powerful web application designed to simplify the tedious process of comparing financial datasets. Whether you are an accountant, data analyst, or business owner, this tool allows you to upload two datasets (e.g., Purchase Register vs. Sales Register) and instantly identify:

-   ✅ **Matches**: Records that exist in both files perfectly.
-   ❌ **Mismatches**: Records where amounts differ between files.
-   ⚠️ **Missing Records**: Invoices present in one file but missing in the other.

Built with a focus on **data density**, **speed**, and **usability**, it features a modern, full-screen dashboard layout.

---

## ✨ Key Features

### 📂 **Data Processing**
-   **Multi-Format Support**: Upload `.csv`, `.xlsx`, or `.xls` files.
-   **Smart Parsing**: Automatically detects headers like `Invoice No`, `Amount`, and `Date` regardless of case or position.
-   **Client-Side Processing**: All data stays in your browser. No data is uploaded to any server, ensuring **100% privacy**.

### 🖥️ **User Interface**
-   **Professional Dashboard**: Full-screen, resizing-responsive layout optimized for desktop productivity.
-   **Unified Data Table**: A single, sortable, and searchable table containing all reconciliation results.
-   **Sticky Headers**: Keep track of column names while scrolling through thousands of rows.
-   **Status Badges**: Color-coded badges (`Matched`, `Mismatched`, `Missing`) for quick visual scanning.

### 🛠️ **Tools & Utilities**
-   **Advanced Filtering**: Filter specific categories (e.g., show only "Mismatched" items).
-   **Global Search**: Instantly find any invoice by number.
-   **History Tracking**: improved: Automatically saves your recent sessions to your browser's local storage so you can pick up where you left off.

---

## 🛠️ Technology Stack

This project is built using modern, performance-focused web technologies:

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | ![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB) | Core UI library for component-based architecture. |
| **Styling** | ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) | Utility-first CSS framework for rapid, responsive design. |
| **Build Tool** | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | Next-generation frontend tooling for blistering fast builds. |
| **Data Parsing** | **SheetJS / PapaParse** | Robust libraries for parsing Excel and CSV files reliably. |
| **Language** | ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white) | Strongly typed JavaScript for scalable and bug-free code. |

---

## 📂 Project Structure

A clean and organized codebase structure:

```text
app/
├── public/              # Static assets
├── src/
│   ├── components/      # UI Building Blocks
│   │   ├── FileUpload.tsx         # File input & processing trigger
│   │   ├── ReconciliationTable.tsx # Main data grid with sorting/filtering
│   │   └── History.tsx            # Session history sidebar
│   ├── utils/           # Core Logic
│   │   ├── matcher.ts   # The brain: compares arrays of data
│   │   ├── parser.ts    # The reader: converts files to JSON
│   │   └── storage.ts   # The memory: handles LocalStorage
│   ├── App.tsx          # Main layout & state manager
│   ├── index.css        # Tailwind imports & global styles
│   └── main.tsx         # Entry point
├── package.json         # Dependencies & scripts
├── tailwind.config.js   # Tailwind configuration
└── vite.config.ts       # Vite configuration
```

---

## 🚦 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
-   **Node.js** (v18 or higher)
-   **npm** (comes with Node.js)

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/smart-reconciliation.git
    cd smart-reconciliation/app
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run Development Server**
    ```bash
    npm run dev
    ```

4.  **Open in Browser**
    Visit `http://localhost:5173` to view the app.

---

## 🌐 Deployment (Vercel)

This project is optimized for deployment on Vercel.

1.  Push your code to **GitHub**.
2.  Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3.  Select your repository.
4.  **Important**: In the configuration step, change the **Root Directory**.
    -   Click **Edit** next to "Root Directory".
    -   Select the **`app`** folder.
5.  Click **Deploy**.

Vercel will detect `Vite` automatically and build your site.

---

## 📝 Usage Guide

1.  **Prepare Your Files**: Ensure you have two files (Excel or CSV) containing invoice data. Minimum required columns are something resembling `Invoice No` and `Amount`.
2.  **Upload**: Use the sidebar to upload File A and File B.
3.  **Analyze**: Click "Reconcile".
4.  **Review**:
    -   Sort by "Difference" to prioritize errors.
    -   Filter by "Missing in B" to find lost invoices.
    -   Click any history item to reload a past comparison.

---

<div align="center">
  <sub>Built with ❤️ by the Smart Reconciliation Team.</sub>
</div>
