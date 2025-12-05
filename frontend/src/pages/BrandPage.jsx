import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  addBrand,
  deleteBrand,
  getAllBrand,
  updateBrand,
} from "../api/brandApi";

const headStyles = {
  fontWeight: "bold",
  fontSize: "10px",
  color: "#333",
  textTransform: "uppercase",
};

export default function BrandPage() {
  //States
  const [updateBrandDialogOpen, setupdateBrandDialogOpen] = useState(false);
  const [addBrandDialogOpen, setAddBrandDialogOpen] = useState(false);
  const [brand, setBrand] = useState([]);
  const [editBrand, seteditBrand] = useState({
    brand_id: "",
    brand_name: "",
    description: "",
  });
  const [newBrand, setnewBrand] = useState({
    brand_id: "",
    brand_name: "",
    description: "",
  });

  //Add brand
  const openAddbrandDialog = () => {
    setAddBrandDialogOpen(true);
  };

  const closeAddbrandDialog = () => {
    setAddBrandDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setnewBrand((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddbrand = async () => {
    if (!newBrand.brand_name || !newBrand.description) {
      alert("Some fields are empty!");
      return;
    }
    try {
      const res = await addBrand(newBrand);
      setBrand((prev) => [...prev, res.data]);
      setnewBrand({
        brand_id: "",
        brand_name: "",
        description: "",
      });
      setAddBrandDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  //Update brand
  const openUpdatebrandDialog = (brand) => {
    seteditBrand(brand);
    setupdateBrandDialogOpen(true);
  };

  const closeUpdatebrandDialog = () => {
    setupdateBrandDialogOpen(false);
  };

  const handleUpdatebrandSubmit = async () => {
    try {
      await updateBrand(editBrand._id, editBrand);
      setBrand((prev) =>
        prev.map((p) => (p._id === editBrand._id ? editBrand : p))
      );
      alert("brand updated successfully!");
      closeUpdatebrandDialog();
    } catch (error) {
      console.error(error);
    }
  };

  //Delete a brand
  const handleDeletebrand = async (brandId) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;

    try {
      await deleteBrand(brandId);
      setBrand((prev) => prev.filter((p) => p._id !== brandId));
    } catch (err) {
      console.error("Error deleting brand:", err);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllBrand();
        setBrand(data.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <Dialog
        open={updateBrandDialogOpen}
        onClose={closeUpdatebrandDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Update Brand</DialogTitle>

        <DialogContent sx={{ paddingTop: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} mt={2}>
              <TextField
                fullWidth
                label="Brand Name"
                value={editBrand.brand_name}
                onChange={(e) =>
                  seteditBrand({
                    ...editBrand,
                    brand_name: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={12} sm={6} mt={2}>
              <TextField
                fullWidth
                label="Description"
                value={editBrand.description}
                onChange={(e) =>
                  seteditBrand({
                    ...editBrand,
                    description: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ padding: 2 }}>
          <Button variant="outlined" onClick={closeUpdatebrandDialog}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUpdatebrandSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h4" marginBottom={3} fontWeight="bold">
        Brand Management
      </Typography>

      <Card elevation={4} sx={{ padding: 1, marginBottom: 2, borderRadius: 3 }}>
        <CardContent>
          <Dialog
            open={addBrandDialogOpen}
            onClose={closeAddbrandDialog}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>Add Brand</DialogTitle>
            <DialogContent sx={{ paddingTop: 2 }}>
              <Grid container spacing={2}>
                <Grid mt={3}>
                  <TextField
                    fullWidth
                    sx={{ maxWidth: 220 }}
                    label="Brand Name"
                    name="brand_name"
                    value={newBrand.brand_name}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid mt={3}>
                  <TextField
                    fullWidth
                    sx={{ maxWidth: 220 }}
                    label="Description"
                    name="description"
                    value={newBrand.description}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ padding: 2 }}>
              <Button variant="outlined" onClick={closeAddbrandDialog}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleAddbrand}>
                Add
              </Button>
            </DialogActions>
          </Dialog>

          <Grid container mt={2}>
            <Grid>
              <Button
                variant="contained"
                fullWidth
                onClick={openAddbrandDialog}
                sx={{ paddingY: 1.6, borderRadius: 2 }}
              >
                Create New Brand
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Paper elevation={3} sx={{ padding: 2, borderRadius: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f7f7f7" }}>
                <TableCell sx={headStyles}>Brand ID</TableCell>
                <TableCell sx={headStyles}>Brand Name</TableCell>
                <TableCell sx={headStyles}>Description</TableCell>
                <TableCell sx={headStyles}></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {brand.map((brand) => (
                <TableRow key={brand._id} hover>
                  <TableCell sx={{ fontSize: "0.8rem" }}>
                    {brand.brand_id}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.8rem" }}>
                    {brand.brand_name}
                  </TableCell>
                  <TableCell>{brand.description}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      sx={{ borderRadius: 2 }}
                      onClick={() => handleDeletebrand(brand._id)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="contained"
                      color="warning"
                      size="small"
                      onClick={() => openUpdatebrandDialog(brand)}
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
