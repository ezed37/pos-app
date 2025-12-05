import React, { useContext, useState } from "react";
import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import AuthContext from "../auth/AuthContext";
import Users from "../pages/Users";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Products from "../pages/Products";
import CategoryPage from "../pages/CategoryPage";
import BrandPage from "../pages/BrandPage";
import Sales from "../pages/Sales";
import Dashboard from "../pages/Dashboard";

const drawerWidth = 240;
const collapsedWidth = 60;

function Mainpage({ toggleMode, currentMode }) {
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => setOpen(!open);

  const { user } = useContext(AuthContext);

  return (
    <Box sx={{ display: "flex" }}>
      {user && (
        <Header toggleMode={toggleMode} currentMode={currentMode} user={user} />
      )}
      {user && <Sidebar open={open} toggleDrawer={toggleDrawer} />}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: user ? 3 : 0,
          marginTop: user ? "64px" : 0,
          transition: "margin 0.3s",
        }}
      >
        <Routes>
          {user ? (
            <>
              <Route path="/users" element={<Users />} />
              <Route path="/products" element={<Products />} />
              <Route path="/category" element={<CategoryPage />} />
              <Route path="/brand" element={<BrandPage />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/" element={<Dashboard />} />
              {/* Add other pages */}
            </>
          ) : (
            <Route path="/*" element={<Login />} />
          )}
        </Routes>
      </Box>
    </Box>
  );
}

export default Mainpage;
