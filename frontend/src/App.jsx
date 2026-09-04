import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Payments from "./pages/Payment";
import PaymentDetails from "./pages/PaymentDetails";
import Investigations from "./pages/Investigations";
import InvestigationDetails from "./pages/InvestigationDetails";
import Incidents from "./pages/Incident";
import Analytics from "./pages/Analytics";
import AIChat from "./pages/AIChat";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/payments" element={<Payments />} />
      <Route path="/payments/:id" element={<PaymentDetails />} />
      <Route path="/investigations" element={<Investigations />} />
      <Route path="/investigation/:paymentId" element={<InvestigationDetails />} />
      <Route path="/incidents" element={<Incidents />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/ai-chat" element={<AIChat />} />
    </Routes>
  );
}

export default App;
