import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Forums from "./pages/Forums";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Forums />} />
        
      </Routes>
    </Router>
  );
}

export default App;
