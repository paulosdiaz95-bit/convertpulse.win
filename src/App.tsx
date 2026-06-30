import React, { useState, useEffect } from "react";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      root.style.backgroundColor = "#0f172a";
      root.style.color = "white";
    } else {
      root.classList.remove("dark");
      root.style.backgroundColor = "white";
      root.style.color = "black";
    }
  }, [darkMode]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      
      <h1>Universal Tools Platform</h1>

      <p style={{ marginTop: "10px" }}>
        If you can see this → Cloudflare deploy is FIXED ✅
      </p>

      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          padding: "10px",
          marginTop: "20px",
          cursor: "pointer",
        }}
      >
        Toggle Theme
      </button>

    </div>
  );
}
