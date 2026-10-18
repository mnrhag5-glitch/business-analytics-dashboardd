
import { createContext, useContext, useMemo, useState } from "react";

const FilterContext = createContext(null);

export function FilterProvider({ children }) {
  const [preset, setPreset] = useState("30d");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [userId, setUserId] = useState("all");
  const [departmentId, setDepartmentId] = useState("all");

  const resetFilters = () => {
    setPreset("30d");
    setCustomStart("");
    setCustomEnd("");
    setUserId("all");
    setDepartmentId("all");
  };

  const value = useMemo(
    () => ({
      preset,
      setPreset,
      customStart,
      setCustomStart,
      customEnd,
      setCustomEnd,
      userId,
      setUserId,
      departmentId,
      setDepartmentId,
      resetFilters,
    }),
    [preset, customStart, customEnd, userId, departmentId],
  );

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
}

export function useDashboardFilters() {
  const context = useContext(FilterContext);

  if (!context) {
    throw new Error(
      "useDashboardFilters must be used inside FilterProvider",
    );
  }

  return context;
}
