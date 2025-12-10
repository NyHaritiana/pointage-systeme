import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import UserProfiles from "./pages/UserProfiles";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import DepartmentTables from "./pages/Tables/DepartmentTables";
import FormElements from "./pages/Forms/FormElements";
import Blanktwo from "./pages/Blanktwo";
import Forbidden from "./pages/Forbidden";
import Horaire from "./pages/Horaire";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import HistoriqueTables from "./pages/Tables/HistoriqueTables";
import DemandeTable from "./pages/Tables/DemandeTable";
import PointageTable from "./pages/Tables/PointageTable";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ProtectedRoute from "./components/auth/ProtectedRoute";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Rediriger la racine vers signin */}
          <Route path="/" element={<Navigate to="/signin" replace />} />

          <Route path="/forbidden" element={<Forbidden />} />

          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            {/* Routes protégées pour admin/rh */}
            <Route
              path="/tableau"
              element={
                <ProtectedRoute allowedRoles={["admin", "rh"]}>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/basic-tables"
              element={
                <ProtectedRoute allowedRoles={["admin", "rh"]}>
                  <BasicTables />
                </ProtectedRoute>
              }
            />
            <Route
              path="/department-tables"
              element={
                <ProtectedRoute allowedRoles={["admin", "rh"]}>
                  <DepartmentTables />
                </ProtectedRoute>
              }
            />
            <Route
              path="/horaire"
              element={
                <ProtectedRoute allowedRoles={["admin", "rh"]}>
                  <Horaire />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pointage"
              element={
                <ProtectedRoute allowedRoles={["admin", "rh"]}>
                  <PointageTable />
                </ProtectedRoute>
              }
            />

            {/* Autres pages accessibles par tous */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blanktwo" element={<Blanktwo />} />
            <Route path="/form-elements" element={<FormElements />} />
            <Route path="/historique-tables" element={<HistoriqueTables />} />
            <Route path="/demande" element={<DemandeTable />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
    </>
  );
}

