import { BrowserRouter, Routes, Route } from "react-router-dom";
import PatientLogin from "./pages/patient/PatientLogin";
import ChatTriage from "./pages/patient/ChatTriage";
import AmbulanceStatus from "./pages/patient/AmbulanceStatus";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PatientLogin />} />
        <Route path="/chat" element={<ChatTriage />} />
        <Route path="/ambulance" element={<AmbulanceStatus />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;