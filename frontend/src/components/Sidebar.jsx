import {
  Box,
  Drawer,
  List,
  ListItemIcon,
  ListItemButton,
  Toolbar,
  ListItemText,
  IconButton,
} from "@mui/material";
import React from "react";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PeopleIcon from "@mui/icons-material/People";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import { Link } from "react-router-dom";

const drawerWidth = 240;
const collapsedWidth = 60;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
  { text: "Sales", icon: <PointOfSaleIcon />, path: "/sales" },
  { text: "Products", icon: <InventoryIcon />, path: "/products" },
  { text: "Categories", icon: <CategoryIcon />, path: "/category" },
  { text: "Brands", icon: <BrandingWatermarkIcon />, path: "/brand" },
  { text: "Suppliers", icon: <LocalShippingIcon /> },
  { text: "Customers", icon: <PeopleIcon /> },
  { text: "Users", icon: <AdminPanelSettingsIcon />, path: "/users" },
  { text: "Report", icon: <AssessmentIcon /> },
];

export default function Sidebar({ open, toggleDrawer }) {
  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        transition: "width 0.3s",
        [`& .MuiDrawer-paper`]: {
          mt: "64px",
          position: "fixed",
          overflowX: "hidden",
          width: open ? drawerWidth : collapsedWidth,
          transition: "width 0.3s",
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar sx={{ justifyContent: open ? "flex-end" : "center" }}>
        <IconButton onClick={toggleDrawer}>
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={Link}
            to={item.path || "#"}
            sx={{
              justifyContent: open ? "flex-start" : "center",
              px: 2,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 2 : "auto",
                justifyContent: "center",
              }}
            >
              {item.icon}
            </ListItemIcon>

            {open && <ListItemText primary={item.text} />}
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
