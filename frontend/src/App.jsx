import React from "react";
import Compress from "./pages/DnaCheck";
import Header from "./components/Header";
import Docs from "./pages/Docs";
import ServicesTest from "./servicetest"; // Import the testing component
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { DnaContextProvider } from "./contexts/DnaContext";

function App() {
  return (
    <Router>
      <Header />
      <DnaContextProvider>
        <Routes>
          <Route path="/" element={<Compress />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/team" element={<ServicesTest />} /> {/* Use the testing component */}
        </Routes>
      </DnaContextProvider>
    </Router>
  );
}

export default App;
