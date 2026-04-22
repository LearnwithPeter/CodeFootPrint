import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home    from "./pages/Home";
import About   from "./pages/About";
import Contact from "./pages/Contact";
import Analyze from "./pages/Analyze";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"        element={<Home    />} />
        <Route path="/about"   element={<About   />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/analyze" element={<Analyze />} />
      </Routes>
    </BrowserRouter>
  );
}
