// Improved Users.jsx with professional UI enhancements and highlighted changes
import { useEffect, useState } from "react";
import { addUser, deleteUser, getUsers, updateUser } from "../api/userApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  Typography,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { TextField } from "@mui/material";

const headStyles = {
  fontWeight: "bold",
  fontSize: "16px",
  color: "#333",
  textTransform: "uppercase",
};

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "cashier",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getUsers();
        setUsers(data.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      (u.firstName?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (u.email?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async () => {
    try {
      const response = await addUser(newUser);
      setUsers((prev) => [...prev, response.data]);
      setNewUser({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "cashier",
      });
      setAddUserDialogOpen(false);
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  const handleDelete = async (userId) => {
    const userToDelete = users.find((u) => u._id === userId);
    const adminCount = users.filter((u) => u.role === "admin").length;

    if (userToDelete.role === "admin" && adminCount === 1) {
      alert("Cannot delete the last admin user!");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // UPDATE USER STATE
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);

  const [editUser, setEditUser] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "cashier",
  });

  // OPEN POPUP
  const openUpdateDialog = (user) => {
    setEditUser(user);
    setUpdateDialogOpen(true);
  };

  // CLOSE POPUP
  const closeUpdateDialog = () => {
    setUpdateDialogOpen(false);
  };

  // SUBMIT UPDATE
  const handleUpdateSubmit = async () => {
    try {
      await updateUser(editUser._id, editUser);
      setUsers((prev) =>
        prev.map((u) => (u._id === editUser._id ? editUser : u))
      );
      setAlerts({
        open: true,
        type: "success",
        msg: "User Updated Successfully!",
      });
      closeUpdateDialog();
    } catch (err) {
      console.error(err);
      setAlerts({ open: true, type: "error", msg: "Failed to Update User!" });
    }
  };

  //Open & close add user dialog
  const openAddDialog = () => {
    setAddUserDialogOpen(true);
  };

  const closeAddDialog = () => {
    setAddUserDialogOpen(false);
  };

  return (
    <>
      <Dialog
        open={updateDialogOpen}
        onClose={closeUpdateDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Update User</DialogTitle>

        <DialogContent sx={{ paddingTop: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} mt={2}>
              <TextField
                fullWidth
                autoFocus
                label="First Name"
                value={editUser.firstName}
                onChange={(e) =>
                  setEditUser({ ...editUser, firstName: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} sm={6} mt={2}>
              <TextField
                fullWidth
                label="Last Name"
                value={editUser.lastName}
                onChange={(e) =>
                  setEditUser({ ...editUser, lastName: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                value={editUser.email}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                value={editUser.phone}
                onChange={(e) =>
                  setEditUser({ ...editUser, phone: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12} minWidth={230}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={editUser.role}
                  onChange={(e) =>
                    setEditUser({ ...editUser, role: e.target.value })
                  }
                >
                  <MenuItem value="cashier">Cashier</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                value={editUser.password}
                onChange={(e) =>
                  setEditUser({ ...editUser, password: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ padding: 2 }}>
          <Button variant="outlined" onClick={closeUpdateDialog}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUpdateSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h4" marginBottom={3} fontWeight="bold">
        Users Management
      </Typography>

      <Dialog
        open={addUserDialogOpen}
        onClose={closeAddDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add User</DialogTitle>
        <DialogContent sx={{ paddingTop: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} m={1}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={newUser.username}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Row 2 */}
            <Grid item xs={12} m={1}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={newUser.password}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
          <Grid container>
            {/* Row 3 */}
            <Grid item xs={12} m={1}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={newUser.firstName}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Row 4 */}
            <Grid item xs={12} m={1}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={newUser.lastName}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
          <Grid container>
            {/* Row 5 */}
            <Grid item xs={12} m={1} minWidth={230}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                >
                  <MenuItem value="cashier">Cashier</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Row 6 */}
            <Grid item xs={12} m={1}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
              />
            </Grid>

            {/* Row 7 */}
            <Grid item xs={12} m={1}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={newUser.phone}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ padding: 2 }}>
          <Button variant="outlined" onClick={closeAddDialog}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAddUser}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* ★ CHANGE: Upgraded UI using Card + better spacing */}
      <Card elevation={4} sx={{ padding: 3, marginBottom: 4, borderRadius: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid container>
              {/* Add User Button */}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={openAddDialog}
                  sx={{ paddingY: 1.6, borderRadius: 2 }}
                >
                  Create a New User
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Paper elevation={3} sx={{ padding: 2, borderRadius: 3 }}>
        <TextField
          label="Search Users"
          variant="outlined"
          fullWidth
          margin="normal"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Divider sx={{ marginBottom: 2 }} />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f7f7f7" }}>
                <TableCell sx={headStyles}>First Name</TableCell>
                <TableCell sx={headStyles}>Email</TableCell>
                <TableCell sx={headStyles}>Role</TableCell>
                <TableCell sx={headStyles}>Phone</TableCell>
                <TableCell sx={headStyles}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.phone}</TableCell>

                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      sx={{ borderRadius: 2 }}
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="contained"
                      color="warning"
                      size="small"
                      onClick={() => openUpdateDialog(user)}
                      sx={{ marginLeft: 1, borderRadius: 2 }}
                    >
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}

export default Users;
