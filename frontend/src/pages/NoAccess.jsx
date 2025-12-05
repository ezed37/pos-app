import { Box, Typography, Button } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

export default function NoAccessPage() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      flexDirection="column"
      textAlign="center"
      sx={{ backgroundColor: "#f5f5f5", p: 3 }}
    >
      <LockIcon sx={{ fontSize: 90, color: "#d32f2f" }} />

      <Typography variant="h4" fontWeight="bold" mt={2}>
        Access Denied
      </Typography>

      <Typography variant="body1" mt={1} color="text.secondary">
        You don't have permission to view this page.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3, px: 4, py: 1.2 }}
        onClick={() => (window.location.href = "/login")}
      >
        Please Login
      </Button>
    </Box>
  );
}
