// import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";

// console.log("React application is starting...");

// React 18
const rootElement = document.getElementById("root") as HTMLElement;
if (!rootElement) {
  throw new Error("Root element not found!"); // `root`가 없을 경우 오류 출력
}

// console.log("Root element:", rootElement);

const root = ReactDOM.createRoot(rootElement);

root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
