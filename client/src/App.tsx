import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { IsMobileProvider } from "./context/MobileContext";
import Home from "./pages/Home";
import Services from "./pages/Services"
import Schedule from "./pages/Schedule";

function App() {

  return (
    <IsMobileProvider>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/schedule" element={<Schedule />} />
          </Routes>
        </main>
      </div>
    </IsMobileProvider>
  )
}

export default App
