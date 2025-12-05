import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
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
import { useEffect, useRef, useState } from "react";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../api/productApi";
import { getAllCategory } from "../api/categoryApi";
import { getAllBrand } from "../api/brandApi";
import { focusSearchInput } from "../services/focusHelper";

const headStyles = {
  fontWeight: "bold",
  fontSize: "9px",
  color: "#333",
  textTransform: "uppercase",
};

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [addProductDialogOpen, setAddProductDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    product_id: "",
    barcode: "",
    product_name: "",
    category_id: "",
    brand_id: "",
    regular_item: false,
    unit: "pkt",
    stock_qty: 0,
    cost_price: 0,
    actual_price: 0,
    selling_price: 0,
  });

  // UPDATE Product STATE
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState({
    _id: "",
    product_id: "",
    barcode: "",
    product_name: "",
    category_id: "",
    brand_id: "",
    regular_item: false,
    unit: "pkt",
    stock_qty: 0,
    cost_price: 0,
    actual_price: 0,
    selling_price: 0,
  });

  const [category, setCategory] = useState([]);
  const [brand, setBrand] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortField, setSortField] = useState("id");

  const addProductRef = useRef(null);

  const filteredProducts = products.filter(
    (p) =>
      (p.product_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (p.barcode?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  //Open and close Product add dialog
  const openAddProductDialog = async () => {
    const cat = await getAllCategory();
    const br = await getAllBrand();

    setCategory(cat.data);
    setBrand(br.data);
    setAddProductDialogOpen(true);
  };

  const closeAddProductDialog = () => {
    setAddProductDialogOpen(false);
  };

  const handleAddProduct = async () => {
    if (
      !newProduct.product_name ||
      !newProduct.category_id ||
      !newProduct.brand_id ||
      !newProduct.selling_price ||
      !newProduct.actual_price ||
      !newProduct.cost_price
    ) {
      alert("Some fields are empty!");
      return;
    }

    try {
      const response = await addProduct(newProduct);
      setProducts((prev) => [...prev, response.data]);
      focusSearchInput(addProductRef);
      setNewProduct({
        product_id: "",
        barcode: "",
        product_name: "",
        category_id: "",
        brand_id: "",
        regular_item: false,
        unit: "pkt",
        stock_qty: 0,
        cost_price: 0,
        actual_price: 0,
        selling_price: 0,
      });
    } catch (err) {
      console.error("Error adding products:", err);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // OPEN POPUP
  const openUpdateDialog = async (product) => {
    const cat = await getAllCategory();
    const br = await getAllBrand();

    setCategory(cat.data);
    setBrand(br.data);

    setEditProduct(product);
    setUpdateDialogOpen(true);
  };

  // CLOSE POPUP
  const closeUpdateDialog = () => {
    setUpdateDialogOpen(false);
  };

  // SUBMIT UPDATE
  const handleUpdateSubmit = async () => {
    try {
      await updateProduct(editProduct._id, editProduct);
      setProducts((prev) =>
        prev.map((p) => (p._id === editProduct._id ? editProduct : p))
      );
      alert("Product updated successfully!");
      closeUpdateDialog();
    } catch (err) {
      console.error(err);
    }
  };

  //Sort product function
  const sortProducts = (field) => {
    return [...filteredProducts].sort((a, b) => {
      if (field === "qty") {
        // Number comparison
        return sortOrder === "asc"
          ? a.stock_qty - b.stock_qty
          : b.stock_qty - a.stock_qty;
      } else if (field === "id") {
        // String comparison
        return sortOrder === "asc"
          ? a.product_id.localeCompare(b.product_id)
          : b.product_id.localeCompare(a.product_id);
      } else {
        return 0;
      }
    });
  };

  //Get products
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllProducts();
        setProducts(data.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <Dialog
        open={updateDialogOpen}
        onClose={closeUpdateDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Update Product</DialogTitle>

        <DialogContent sx={{ paddingTop: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} mt={2}>
              <TextField
                fullWidth
                label="Product Name"
                value={editProduct.product_name}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    product_name: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={12} sm={6} mt={2}>
              <TextField
                fullWidth
                label="Barcode"
                value={editProduct.barcode}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, barcode: e.target.value })
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                sx={{ minWidth: 230 }}
                label="Regular Item"
                name="regular_item"
                value={editProduct.regular_item}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    regular_item: e.target.value,
                  })
                }
              >
                <MenuItem value={true}>True</MenuItem>
                <MenuItem value={false}>False</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                sx={{ minWidth: 230 }}
                label="Category Name"
                value={editProduct.category_id}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    category_id: e.target.value,
                  })
                }
              >
                {category.map((ctg) => (
                  <MenuItem key={ctg.category_id} value={ctg.category_id}>
                    {ctg.category_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                sx={{ minWidth: 230 }}
                label="Brand Name"
                value={editProduct.brand_id}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    brand_id: e.target.value,
                  })
                }
              >
                {brand.map((br) => (
                  <MenuItem key={br.brand_id} value={br.brand_id}>
                    {br.brand_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                sx={{ minWidth: 230 }}
                label="Unit"
                value={editProduct.unit}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    unit: e.target.value,
                  })
                }
              >
                <MenuItem value="pkt">Packet</MenuItem>
                <MenuItem value="weight">Weight</MenuItem>
                <MenuItem value="length">Length</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Stock Qty"
                value={editProduct.stock_qty}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    stock_qty: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Cost Price (Rs.) per Unit"
                value={editProduct.cost_price}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    cost_price: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Actual Price (Rs.) per Unit"
                value={editProduct.actual_price}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    actual_price: e.target.value,
                  })
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Selling Price (Rs.) per Unit"
                value={editProduct.selling_price}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    selling_price: e.target.value,
                  })
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
        Product Management
      </Typography>

      <Card elevation={4} sx={{ padding: 1, marginBottom: 2, borderRadius: 3 }}>
        <CardContent>
          <Dialog
            open={addProductDialogOpen}
            onClose={closeAddProductDialog}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>Add Product</DialogTitle>
            <DialogContent sx={{ paddingTop: 2 }}>
              <Grid container spacing={2}>
                <Grid mt={3}>
                  <TextField
                    autoFocus
                    inputRef={addProductRef}
                    fullWidth
                    sx={{ maxWidth: 220 }}
                    label="Barcode"
                    name="barcode"
                    value={newProduct.barcode}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid mt={3}>
                  <TextField
                    fullWidth
                    sx={{ maxWidth: 220 }}
                    label="Product Name"
                    name="product_name"
                    value={newProduct.product_name}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid>
                  <TextField
                    select
                    fullWidth
                    sx={{ minWidth: 220 }}
                    label="Category Name"
                    name="category_id"
                    value={newProduct.category_id}
                    onChange={handleInputChange}
                  >
                    {category.map((ctg) => (
                      <MenuItem key={ctg.category_id} value={ctg.category_id}>
                        {ctg.category_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid>
                  <TextField
                    select
                    fullWidth
                    sx={{ minWidth: 220 }}
                    label="Brand Name"
                    name="brand_id"
                    value={newProduct.brand_id}
                    onChange={handleInputChange}
                  >
                    {brand.map((br) => (
                      <MenuItem key={br.brand_id} value={br.brand_id}>
                        {br.brand_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid>
                  <TextField
                    select
                    fullWidth
                    sx={{ minWidth: 220 }}
                    label="Regular Item"
                    name="regular_item"
                    value={newProduct.regular_item}
                    onChange={handleInputChange}
                  >
                    <MenuItem value={true}>True</MenuItem>
                    <MenuItem value={false}>False</MenuItem>
                  </TextField>
                </Grid>

                <Grid>
                  <TextField
                    select
                    fullWidth
                    sx={{ minWidth: 220 }}
                    label="Unit"
                    name="unit"
                    value={newProduct.unit}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="pkt">Packet</MenuItem>
                    <MenuItem value="weight">Weight</MenuItem>
                    <MenuItem value="length">Length</MenuItem>
                  </TextField>
                </Grid>

                <Grid>
                  <TextField
                    fullWidth
                    sx={{ maxWidth: 220 }}
                    label="Stock Qty"
                    name="stock_qty"
                    value={newProduct.stock_qty}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid>
                  <TextField
                    fullWidth
                    sx={{ maxWidth: 220 }}
                    label="Cost Price (Rs.) per Unit"
                    name="cost_price"
                    value={newProduct.cost_price}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid>
                  <TextField
                    fullWidth
                    sx={{ maxWidth: 220 }}
                    label="Actual Price (Rs.) per Unit"
                    name="actual_price"
                    value={newProduct.actual_price}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid>
                  <TextField
                    fullWidth
                    sx={{ maxWidth: 220 }}
                    label="Selling Price (Rs.) per Unit"
                    name="selling_price"
                    value={newProduct.selling_price}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ padding: 2 }}>
              <Button variant="outlined" onClick={closeAddProductDialog}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleAddProduct}>
                Add
              </Button>
            </DialogActions>
          </Dialog>

          <Grid container mt={2}>
            <Grid>
              <Button
                variant="contained"
                fullWidth
                onClick={openAddProductDialog}
                sx={{ paddingY: 1.6, borderRadius: 2 }}
              >
                Create New Product
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Paper elevation={3} sx={{ padding: 2, borderRadius: 3 }}>
        <TextField
          label="Search Product"
          variant="outlined"
          fullWidth
          margin="normal"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Divider sx={{ marginBottom: 2 }} />

        <TableContainer>
          <Table>
            <TableHead sx>
              <TableRow sx={{ backgroundColor: "#f7f7f7" }}>
                <TableCell sx={headStyles}>
                  Product ID
                  <Button
                    size="small"
                    onClick={() => {
                      setSortField("id");
                      setSortOrder(
                        sortField === "id" && sortOrder === "asc"
                          ? "desc"
                          : "asc"
                      );
                    }}
                    sx={{ ml: 0, m: 0, p: 0 }}
                  >
                    {sortField === "id" && sortOrder === "asc" ? "↑" : "↓"}
                  </Button>
                </TableCell>
                <TableCell sx={headStyles}>Product Name</TableCell>
                <TableCell sx={headStyles}>
                  Stock Qty
                  <Button
                    size="small"
                    onClick={() => {
                      setSortField("qty");
                      setSortOrder(
                        sortField === "qty" && sortOrder === "asc"
                          ? "desc"
                          : "asc"
                      );
                    }}
                    sx={{ ml: 0, m: 0, p: 0 }}
                  >
                    {sortField === "qty" && sortOrder === "asc" ? "↑" : "↓"}
                  </Button>
                </TableCell>
                <TableCell sx={headStyles}>Cost Price</TableCell>
                <TableCell sx={headStyles}>Actual Price</TableCell>
                <TableCell sx={headStyles}>Selling Price</TableCell>
                <TableCell sx={headStyles}></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sortProducts(sortField).map((product) => (
                <TableRow key={product._id} hover>
                  <TableCell sx={{ fontSize: "0.8rem" }}>
                    {product.product_id}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.8rem" }}>
                    {product.product_name}
                  </TableCell>
                  <TableCell>{product.stock_qty}</TableCell>
                  <TableCell>{Number(product?.cost_price ?? 0)}</TableCell>
                  <TableCell>{Number(product?.actual_price ?? 0)}</TableCell>
                  <TableCell>{Number(product?.selling_price ?? 0)}</TableCell>

                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      sx={{ borderRadius: 2 }}
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="contained"
                      color="warning"
                      size="small"
                      onClick={() => openUpdateDialog(product)}
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

export default Products;
