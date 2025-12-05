import {
  AppBar,
  Avatar,
  IconButton,
  Toolbar,
  Typography,
  Box,
} from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../auth/AuthContext";

export default function Header({ toggleMode, currentMode, user }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // remove token / clear user
    navigate("/login"); // redirect to login page
  };
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        {/* Left side: Title */}
        <Typography
          variant="h6"
          noWrap
          sx={{
            flexGrow: 1,
            whiteSpace: "normal",
            lineHeight: 1.2,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          POS System
        </Typography>

        {/* Right side: dark/light toggle + avatar */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton color="inherit" onClick={toggleMode}>
            {currentMode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>

          <IconButton color="inherit" onClick={handleLogout}>
            <Avatar sx={{ bgcolor: deepOrange[500] }} alt="Avatar">
              {user?.username ? user.username.charAt(0).toUpperCase() : "U"}
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
