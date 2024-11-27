import { createContext, useContext, useState, ReactNode } from "react";

interface CostVisibilityContextType {
  showActualCosts: boolean;
  toggleActualCosts: () => void;
}

const CostVisibilityContext = createContext<CostVisibilityContextType | undefined>(undefined);

export function CostVisibilityProvider({ children }: { children: ReactNode }) {
  const [showActualCosts, setShowActualCosts] = useState(true);

  const toggleActualCosts = () => {
    setShowActualCosts(prev => !prev);
  };

  return (
    <CostVisibilityContext.Provider value={{ showActualCosts, toggleActualCosts }}>
      {children}
    </CostVisibilityContext.Provider>
  );
}

export function useCostVisibility() {
  const context = useContext(CostVisibilityContext);
  if (context === undefined) {
    throw new Error("useCostVisibility must be used within a CostVisibilityProvider");
  }
  return context;
}