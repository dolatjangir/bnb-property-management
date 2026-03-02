"use client";

import { getPropertyFieldLabel } from "@/store/settings/property/propertyfields/propertyfields";
import React, { createContext, useContext, useEffect, useState } from "react";

type LabelMap = Record<string, string>;

interface PropertyFieldLabelContextType {
  labels: LabelMap;
  getLabel: (fieldKey: string, defaultLabel?: string) => string;
  updateLabel: (fieldKey: string, displayLabel: string) => void;
  refreshLabels: () => Promise<void>;
}

const PropertyFieldLabelContext =
  createContext<PropertyFieldLabelContextType | null>(null);

export const PropertyFieldLabelProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [labels, setLabels] = useState<LabelMap>({});

  // 🔹 Initial + manual reload
  const loadLabels = async () => {
    const res = await getPropertyFieldLabel();
    if (res) setLabels(res);
  };

  useEffect(() => {
    loadLabels();
  }, []);

  // 🔹 Read label
  const getLabel = (fieldKey: string, defaultLabel?: string) => {
    return labels[fieldKey] || defaultLabel || fieldKey;
  };

  // REAL-TIME UPDATE (no refresh needed)
  const updateLabel = (fieldKey: string, displayLabel: string) => {
    setLabels((prev) => ({
      ...prev,
      [fieldKey]: displayLabel,
    }));
  };

  return (
    <PropertyFieldLabelContext.Provider
      value={{
        labels,
        getLabel,
        updateLabel,
        refreshLabels: loadLabels,
      }}
    >
      {children}
    </PropertyFieldLabelContext.Provider>
  );
};

export const usePropertyFieldLabel = () => {
  const context = useContext(PropertyFieldLabelContext);
  if (!context) {
    throw new Error(
      "usePropertyFieldLabel must be used inside PropertyFieldLabelProvider"
    );
  }
  return context;
};
