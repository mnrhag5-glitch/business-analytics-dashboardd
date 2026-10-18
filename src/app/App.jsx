
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { FilterProvider } from "./FilterContext";
import { ThemeProvider } from "./ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <FilterProvider>
          <AppRoutes />
        </FilterProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
