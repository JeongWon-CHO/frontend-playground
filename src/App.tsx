import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import WebWorker from "./pages/WebWorker";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/web-worker" element={<WebWorker />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
