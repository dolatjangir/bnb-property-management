"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface PropertyImportContextType {
    excelHeaders: string[];
    setExcelHeaders: (headers: string[]) => void;
    file: File | null;               // ADD
    setFile: (file: File | null) => void;
}

const PropertyImportContext = createContext<PropertyImportContextType | undefined>(undefined);

export function PropertyImportProvider({ children }: { children: ReactNode }) {
    const [excelHeaders, setExcelHeaders] = useState<string[]>([]);
    const [file, setFile] = useState<File | null>(null);

    return (
        <PropertyImportContext.Provider value={{
            excelHeaders, setExcelHeaders, file,                // ADD
            setFile
        }}>
            {children}
        </PropertyImportContext.Provider>
    );
}

export function usePropertyImport() {
    const context = useContext(PropertyImportContext);
    if (!context) {
        throw new Error("usePropertyImport must be used inside PropertyImportProvider");
    }
    return context;
}
