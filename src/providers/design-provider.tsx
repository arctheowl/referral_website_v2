"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Design = "mintlify" | "ibm";

interface DesignContextValue {
  design: Design;
  setDesign: (d: Design) => void;
}

const DesignContext = createContext<DesignContextValue>({
  design: "mintlify",
  setDesign: () => {},
});

export function DesignProvider({ children }: { children: React.ReactNode }) {
  const [design, setDesignState] = useState<Design>("mintlify");

  useEffect(() => {
    const current = document.documentElement.classList.contains("design-ibm")
      ? "ibm"
      : "mintlify";
    setDesignState(current);
  }, []);

  function setDesign(next: Design) {
    setDesignState(next);
    const html = document.documentElement;
    if (next === "ibm") {
      html.classList.add("design-ibm");
    } else {
      html.classList.remove("design-ibm");
    }
    try {
      localStorage.setItem("design", next);
    } catch {}
  }

  return (
    <DesignContext.Provider value={{ design, setDesign }}>
      {children}
    </DesignContext.Provider>
  );
}

export function useDesign() {
  return useContext(DesignContext);
}
