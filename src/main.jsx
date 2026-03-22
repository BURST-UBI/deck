import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Deck from "./BURST_Deck";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Deck />
  </StrictMode>
);
