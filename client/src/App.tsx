import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { IsMobileProvider } from "./context/MobileContext";
import Home from "./pages/Home";
import Services from "./pages/Services"
import Schedule from "./pages/Schedule";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./utils/ProtectedRoute";
import Members from "./pages/Members";
import SelectMembership from "./pages/SelectMembership";
import CustomizeMembership from "./pages/CustomizeMembership";
import ScrollToTop from "./ScrollToTop";
import Admin from "./pages/Admin";
import MemberWaitlist from "./pages/MemberWaitlist";
import Membership from "./pages/Membership";

function App() {

  return (
    <IsMobileProvider>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/memberships" element={<Membership />} />

            {/* Protected Routes */}
            <Route
              path="/members"
              element={
                <ProtectedRoute>
                  <Members />
                </ProtectedRoute>
              }
            />
            <Route
              path="/select-membership"
              element={
                <ProtectedRoute>
                  <SelectMembership />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customize-membership"
              element={
                <ProtectedRoute>
                  <CustomizeMembership />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/member-waitlist"
              element={
                <ProtectedRoute>
                  <MemberWaitlist />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </IsMobileProvider>
  )
}

export default App
