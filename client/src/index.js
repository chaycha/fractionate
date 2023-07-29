import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { RouterProvider } from "react-router-dom";
import { App } from "./App";
import { inject } from "@vercel/analytics";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

const theme = createTheme({
  palette: {
    primary: { main: "#3a34d2" },
  },
});

root.render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={App} />
    </ThemeProvider>
  </StrictMode>
);

inject();
