import * as React from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { createRoot } from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import AppRoutes from "./Routes";
import AuthProvider from "./context/AuthContext";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);

root.render(
  <AuthProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes />
    </ThemeProvider>
  </AuthProvider>
);
