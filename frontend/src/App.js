import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./Pages/EncryptPage";
import ImageViewer from "./Pages/ImageViewer";
import DecryptPage from "./Pages/DecryptPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/decrypt" element={<DecryptPage />} />
        <Route path="/:hashValue" element={<ImageViewer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
