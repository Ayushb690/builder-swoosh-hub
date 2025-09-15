import "./global.css";

import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import UserDashboard from "./pages/UserDashboard";
import AuthorityDashboard from "./pages/AuthorityDashboard";
import NotFound from "./pages/NotFound";
import { getUser } from "@/state/store";

function RequireRole({ role, children }) {
  const user = getUser();
  if (!user || user.role !== role) return <Navigate to="/sign-in" replace />;
  return children;
}

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route
        path="/user"
        element={
          <RequireRole role="User">
            <UserDashboard />
          </RequireRole>
        }
      />
      <Route
        path="/authority"
        element={
          <RequireRole role="Authority">
            <AuthorityDashboard />
          </RequireRole>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

createRoot(document.getElementById("root")!).render(<App />);
