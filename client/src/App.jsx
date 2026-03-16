import { useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import { getTheme, setTheme as saveTheme } from "./utils/themeStorage";

function App() {
  const [theme, setTheme] = useState(() => getTheme());

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    saveTheme(theme);
  }, [theme]);

  return <AppRoutes theme={theme} setTheme={setTheme} />;
}

export default App;