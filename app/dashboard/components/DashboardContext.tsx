"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";

interface CTAProps {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
}

interface SearchProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  hidden?: boolean;
}

interface DashboardContextType {
  headerTitle: string;
  setHeaderTitle: (title: string) => void;
  cta: CTAProps | null;
  setCta: (cta: CTAProps | null) => void;
  search: SearchProps;
  setSearch: (search: Partial<SearchProps>) => void;
  extra: ReactNode | null;
  setExtra: (extra: ReactNode | null) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [headerTitle, setHeaderTitle] = useState("");
  const [cta, setCta] = useState<CTAProps | null>(null);
  const [extra, setExtra] = useState<ReactNode | null>(null);
  const [search, setSearchState] = useState<SearchProps>({
    placeholder: "Search...",
    value: "",
    onChange: () => {},
    hidden: false,
  });

  const setSearch = useCallback((newSearch: Partial<SearchProps>) => {
    setSearchState((prev) => ({ ...prev, ...newSearch }));
  }, []);

  const value = useMemo(() => ({
    headerTitle,
    setHeaderTitle,
    cta,
    setCta,
    search,
    setSearch,
    extra,
    setExtra,
  }), [headerTitle, cta, search, extra, setSearch]);

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
