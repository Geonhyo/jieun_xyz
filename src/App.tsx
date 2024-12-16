import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Canvas from "./pages/Canvas/Canvas";

const App: React.FC = () => {
  useEffect(() => {
    function listener(event: TouchEvent) {
      // Prevent pinch zoom
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    }

    window.addEventListener("touchmove", listener, { passive: false });

    return () => {
      window.removeEventListener("touchmove", listener);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/2024-12-21" element={<Canvas />} />
      </Routes>
    </Router>
  );
};

export default App;
