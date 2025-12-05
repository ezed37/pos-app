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
  addCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "../api/categoryApi";

const headStyles = {
  fontWeight: "bold",
  fontSize: "10px",
  color: "#333",
  textTransform: "uppercase",
};

export default function CategoryPage() {
  //States
  const [updateCategoryDialogOpen, setUpdateCategoryDialogOpen] =
    useState(false);
  const [addCategoryDialogOpen, setAddCategoryDialogOpen] = useState(false);
  const [category, setCategory] = useState([]);
  const [editCategory, setEditCategory] = useState({
    category_id: "",
    category_name: "",
    description: "",
  });
  const [newCategory, setNewCategory] = useState({
    category_id: "",
    category_name: "",
    description: "",
  });

  //Add category
  const openAddCategoryDialog = () => {
    setAddCategoryDialogOpen(true);
  };

  const closeAddCategoryDialog = () => {
    setAddCategoryDialogOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCategory = async () => {
    if (!newCategory.category_name || !newCategory.description) {
      alert("Some fields are empty!");
      return;
    }
    try {
      const res = await addCategory(newCategory);
      setCategory((prev) => [...prev, res.data]);
      setNewCategory({
        category_id: "",
        category_name: "",
        description: "",
      });
      setAddCategoryDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  //Update category
  const openUpdateCategoryDialog = (category) => {
    setEditCategory(category);
    setUpdateCategoryDialogOpen(true);
  };

  const closeUpdateCategoryDialog = () => {
    setUpdateCategoryDialogOpen(false);
  };

  const handleUpdateCategorySubmit = async () => {
    try {
      await updateCategory(editCategory._id, editCategory);
      setCategory((prev) =>
        prev.map((p) => (p._id === editCategory._id ? editCategory : p))
      );
      alert("Category updated successfully!");
      closeUpdateCategoryDialog();
    } catch (error) {
      console.error(error);
    }
  };

  //Delete a category
  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      await deleteCategory(categoryId);
      setCategory((prev) => prev.filter((p) => p._id !== categoryId));
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllCategory();
        setCategory(data.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <Dialog
        open={updateCategoryDialogOpen}
        onClose={closeUpdateCategoryDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Update Category</DialogTitle>

        <DialogContent sx={{ paddingTop: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} mt={2}>
              <TextField
                fullWidth
                label="Category Name"
                value={editCategory.category_name}
                onChange={(e) =>
                  setEditCategory({
                    ...editCategory,
                    category_name: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={12} sm={6} mt={2}>
              <TextField
                fullWidth
                label="Description"
                value={editCategory.description}
                onChange={(e) =>
                  setEditCategory({
                    ...editCategory,
                    description: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ padding: 2 }}>
          <Button variant="outlined" onClick={closeUpdateCategoryDialog}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleUpdateCategorySubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Typography variant="h4" marginBottom={3} fontWeight="bold">
        Category Management
      </Typography>

      <Card elevation={4} sx={{ padding: 1, marginBottom: 2, borderRadius: 3 }}>
        <CardContent>
          <Dialog
            open={addCategoryDialogOpen}
            onClose={closeAddCategoryDialog}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>Add Category</DialogTitle>
            <DialogContent sx={{ paddingTop: 2 }}>
              <Grid container spacing={2}>
                <Grid mt={3}>
                  <TextField
                    fullWidth
                    sx={{ maxWidth: 220 }}
                    label="Category Name"
                    name="category_name"
                    value={newCategory.category_name}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid mt={3}>
                  <TextField
                    fullWidth
                    sx={{ maxWidth: 220 }}
                    label="Description"
                    name="description"
                    value={newCategory.description}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ padding: 2 }}>
              <Button variant="outlined" onClick={closeAddCategoryDialog}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleAddCategory}>
                Add
              </Button>
            </DialogActions>
          </Dialog>

          <Grid container mt={2}>
            <Grid>
              <Button
                variant="contained"
                fullWidth
                onClick={openAddCategoryDialog}
                sx={{ paddingY: 1.6, borderRadius: 2 }}
              >
                Create New Category
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
                <TableCell sx={headStyles}>Category ID</TableCell>
                <TableCell sx={headStyles}>Category Name</TableCell>
                <TableCell sx={headStyles}>Description</TableCell>
                <TableCell sx={headStyles}></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {category.map((category) => (
                <TableRow key={category._id} hover>
                  <TableCell sx={{ fontSize: "0.8rem" }}>
                    {category.category_id}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.8rem" }}>
                    {category.category_name}
                  </TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      sx={{ borderRadius: 2 }}
                      onClick={() => handleDeleteCategory(category._id)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="contained"
                      color="warning"
                      size="small"
                      onClick={() => openUpdateCategoryDialog(category)}
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
