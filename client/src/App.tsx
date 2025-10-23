import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import UserProfiles from "./pages/UserProfiles";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import DepartmentTables from "./pages/Tables/DepartmentTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import Blanktwo from "./pages/Blanktwo";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import HistoriqueTables from "./pages/Tables/HistoriqueTables";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />
            <Route path="/blanktwo" element={<Blanktwo />} />

            {/* Forms */}
            <Route path="/form-elements" element={<FormElements />} />

            {/* Tables base */}
            <Route path="/basic-tables" element={<BasicTables />} />

            {/* Tables department */}
            <Route path="/department-tables" element={<DepartmentTables />} />

            {/* Tables department */}
            <Route path="/historique-tables" element={<HistoriqueTables />} />

          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

        </Routes>
      </Router>
    </>
  );
}
