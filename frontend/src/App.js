import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./Pages/EncryptPage";
import DecryptPage from "./Pages/DecryptPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/decrypt" element={<DecryptPage />} />
        <Route path="/decrypt/:hashValue" element={<DecryptPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
