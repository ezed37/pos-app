import { Routes, Route, Navigate } from "react-router-dom";
import AuthContext from "./auth/AuthContext";
import { useContext } from "react";
import Mainpage from "./components/Mainpage";
import Login from "./pages/Login";
import CashierSalePage from "./pages/SalesPage";
import NoAccess from "./pages/NoAccess";

function App({ toggleMode, currentMode }) {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Root route or any other unknown route */}
      <Route
        path="/*"
        element={
          !user ? (
            <Navigate to="/login" replace />
          ) : user.role === "admin" ? (
            <Mainpage
              toggleMode={toggleMode}
              currentMode={currentMode}
              user={user}
            />
          ) : user.role === "cashier" ? (
            <CashierSalePage
              toggleMode={toggleMode}
              currentMode={currentMode}
              user={user}
            />
          ) : (
            <NoAccess />
          )
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
export default App;
