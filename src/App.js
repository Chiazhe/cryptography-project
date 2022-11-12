import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./MainPage";
import ImageViewer from "./ImageViewer";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<MainPage />} />
				<Route path="/:hashValue" element={<ImageViewer />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
