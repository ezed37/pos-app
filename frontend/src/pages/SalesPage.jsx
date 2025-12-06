import React, { useEffect, useEffectEvent, useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardActionArea,
  TextField,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import Header from "../components/Header";
import { focusSearchInput } from "../services/focusHelper.js";
import useCart from "../hooks/useCart.js";
import { printReceipt as printReceiptUtil } from "../utils/recieptPrinter.js";
import { getAllProducts, updateProductBulk } from "../api/productApi.js";
import { addSale } from "../api/salesApi.js";

const stock_threshold = 20;

export default function CashierSalePage({ toggleMode, currentMode, user }) {
  const [dialogItem, setDialogItem] = useState(null);
  const [dialogQty, setDialogQty] = useState(1);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [customerCash, setCustomerCash] = useState("");
  const [balance, setBalance] = useState(null);
  const [allItems, setAllItems] = useState([]);
  const [quickList, setQuickList] = useState([]);
  const [search, setSearch] = useState("");

  const {
    cart,
    discount,
    setDiscount,
    inputValue,
    setInputValue,
    addItem,
    updateQty,
    removeItem,
    clearCart,
    subtotal,
    finalTotal,
  } = useCart([]);

  const searchRef = useRef(null);

  const openAddDialog = (item) => {
    if (item.stock_qty > stock_threshold) {
      setDialogItem(item);
      setDialogQty(1);
    } else if (item.stock_qty <= stock_threshold && item.stock_qty > 0) {
      alert(`Your ${item.product_name} stock is low`);
      setDialogItem(item);
      setDialogQty(1);
    } else {
      alert(`${item.product_name} : Empty stock!`);
    }
  };

  const confirmAddItem = () => {
    if (!dialogItem) return;
    addItem(dialogItem, dialogQty);
    setDialogItem(null);
    setInputValue("");
    setSearch("");
    setTimeout(() => focusSearchInput(searchRef), 50);
  };

  const handleAddFromInput = () => {
    const item = allItems.find((i) => i.barcode === search.trim());
    if (item) {
      openAddDialog(item);
      setInputValue("");
    } else if (allItems.length === 1) {
      openAddDialog(allItems[0]);
      setInputValue("");
    } else {
      alert("No items found!");
      setSearch("");
    }
  };

  const openPaymentDialog = () => {
    setPaymentDialogOpen(true);
    setCustomerCash("");
    setBalance(null);
  };

  const confirmPayment = () => {
    const cash = Number(customerCash);
    if (isNaN(cash) || cash < finalTotal) {
      alert("Customer cash is insufficient!");
      return;
    }

    const bal = cash - finalTotal;
    setBalance(bal);

    setTimeout(() => {
      const receiptData = {
        cart: [...cart],
        subtotal,
        discount,
        finalTotal,
        customerCash: cash,
        balance: bal,
      };

      //update QTY data
      handleUpdateQty();

      //Save sales data
      handleSaleData();

      printReceiptUtil(receiptData);

      clearCart();
      setDiscount(0);
      setCustomerCash("");
      setInputValue("");
      setBalance(null);
      setPaymentDialogOpen(false);
      focusSearchInput(searchRef);
    }, 500);
  };

  //Handle sales data
  const handleSaleData = async () => {
    //Create a doc for the sale
    const itemsData = cart.map((p) => ({
      product_id: p.product_id,
      product_name: p.product_name,
      qty: p.qty,
      cost_price: p.cost_price,
      selling_price: p.selling_price,
    }));

    const salesData = {
      user_name: user.username,
      reference: "INV-" + Date.now(),
      sub_total: subtotal,
      discount: discount,
      final_total: finalTotal,
      items: itemsData,
    };

    await addSale(salesData);
  };

  //Handle update qty
  const handleUpdateQty = async () => {
    try {
      const result = cart.map((item) => ({
        product_id: item._id,
        stock_qty: item.qty,
      }));

      await updateProductBulk(result);
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewSale = () => {
    if (window.confirm("Start a new sale? This will clear the cart.")) {
      clearCart();
      setDiscount(0);
      setCustomerCash("");
      setBalance(null);
      setInputValue("");
      focusSearchInput(searchRef);
    }
  };

  const handleDeleteItemFocus = (id) => {
    removeItem(id);
    focusSearchInput(searchRef);
  };

  const filteredProducts = allItems.filter(
    (p) =>
      (p.product_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (p.barcode?.toLowerCase() || "").includes(search.toLowerCase())
  );
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "Shift") {
        e.preventDefault();
        if (cart.length === 0) {
          alert("Cart is empty!");
          focusSearchInput(searchRef);
          return;
        }
        openPaymentDialog();
      } else if (e.key === "F9") {
        e.preventDefault();
        handleNewSale();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cart, finalTotal]);

  useEffect(() => {
    focusSearchInput(searchRef);
  }, [currentMode]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await getAllProducts();
      const allProducts = res.data || [];

      const regularItems = allProducts.filter(
        (item) => item.regular_item === true
      );

      setAllItems(allProducts);
      setQuickList(regularItems);
    };

    fetchProducts();
  }, []);

  return (
    <Box p={3} sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Header toggleMode={toggleMode} currentMode={currentMode} user={user} />

      <Grid container spacing={3} mt={8}>
        {/* New Sale Button */}
        <Box
          position="fixed"
          top={80}
          right={20}
          zIndex={1000}
          sx={{ boxShadow: 3, borderRadius: 1 }}
        >
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={handleNewSale}
          >
            New Sale
          </Button>
        </Box>

        {/* Quick Items */}
        <Grid>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 3, color: "primary.main" }}
          >
            Regular Items
          </Typography>
          {quickList.map((item) => (
            <Card
              key={item._id}
              sx={{
                padding: 0,
                mb: 0.5,
                borderRadius: 1.5,
                boxShadow: 2,
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                  bgcolor: "primary.light",
                },
                maxWidth: 100,
                textAlign: "center",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
            >
              <CardActionArea onClick={() => openAddDialog(item)}>
                <Box p={2}>
                  <Typography
                    color="text.primary"
                    sx={{ fontWeight: 500, fontSize: "1rem" }}
                  >
                    {item.product_name}
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          ))}
        </Grid>

        {/* Items Table */}
        <Grid>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              inputRef={searchRef}
              type="text"
              placeholder="Search Items or Scan Barcode"
              value={search}
              autoFocus
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddFromInput()}
              fullWidth
              size="small"
            />
            <Button
              variant="contained"
              sx={{ fontSize: "small", padding: 0 }}
              onClick={handleAddFromInput}
            >
              <AddIcon />
            </Button>
          </Box>

          <TableContainer
            component={Paper}
            sx={{
              bgcolor: "background.paper",
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: 3,
            }}
          >
            <Table size="small">
              <TableHead sx={{ bgcolor: "primary.main" }}>
                <TableRow>
                  {[
                    "Item ID",
                    "Item Name",
                    "Normal Price",
                    "Selling Price (Rs.)",
                    "",
                  ].map((head) => (
                    <TableCell
                      key={head}
                      sx={{
                        color: "primary.contrastText",
                        fontWeight: "bold",
                        py: 0,
                        px: 1,
                        fontSize: "0.7rem",
                      }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map((item, index) => (
                  <TableRow
                    key={item._id}
                    sx={{
                      "&:hover": { bgcolor: "action.hover", cursor: "pointer" },
                      bgcolor:
                        index % 2 === 0
                          ? "background.default"
                          : "action.selected",
                    }}
                  >
                    <TableCell
                      sx={{
                        maxWidth: 120,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.product_name}
                    </TableCell>
                    <TableCell>{Number(item.actual_price)}</TableCell>
                    <TableCell>{Number(item.selling_price)}</TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        size="small"
                        sx={{ p: 0 }}
                        onClick={() => openAddDialog(item)}
                      >
                        <AddIcon fontSize="small" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Cart Section */}
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "90vh",
            minWidth: "500px",
          }}
        >
          <Typography variant="h6" mb={0}>
            Cart
          </Typography>

          <TableContainer
            component={Paper}
            sx={{
              flex: 1,
              mb: 0,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 3,
              overflowY: "auto",
            }}
          >
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ p: 0, pl: 2 }}>
                    <strong>Item</strong>
                  </TableCell>
                  <TableCell sx={{ p: 0 }}>
                    <strong>Qty</strong>
                  </TableCell>
                  <TableCell sx={{ p: 0 }}>
                    <strong>Total (Rs.)</strong>
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.product_name}</TableCell>
                    <TableCell>
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) =>
                          updateQty(item.id, Number(e.target.value))
                        }
                        style={{ width: "50px", margin: 0, padding: 0 }}
                      />
                    </TableCell>
                    <TableCell>
                      {item.qty * Number(item.selling_price)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        sx={{ minWidth: "auto", padding: "2px 4px" }}
                        onClick={() => handleDeleteItemFocus(item.id)}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider sx={{ my: 2 }} />

          <TextField
            type="number"
            label="Discount %"
            variant="outlined"
            size="small"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            fullWidth
          />

          <Box mt={1}>
            <Typography>Subtotal: Rs. {subtotal.toFixed(2)}</Typography>
            <Typography>Discount: {discount}%</Typography>
            <Typography variant="h6">
              Final Total: Rs. {finalTotal.toFixed(2)}
            </Typography>
            {balance !== null && (
              <Typography variant="h6" color="green">
                Balance: Rs. {balance.toFixed(2)}
              </Typography>
            )}
          </Box>

          <Button
            variant="contained"
            color="success"
            size="large"
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => {
              if (cart.length === 0) {
                alert("Cart is empty!");
                focusSearchInput(searchRef);
              } else {
                openPaymentDialog();
              }
            }}
          >
            Complete Sale
          </Button>
        </Grid>
      </Grid>

      {/* Add Item Dialog */}
      <Dialog
        open={Boolean(dialogItem)}
        onClose={() => setDialogItem(null)}
        PaperProps={{ sx: { bgcolor: "background.paper" } }}
      >
        <DialogTitle>Add Item</DialogTitle>
        <DialogContent>
          <Typography mb={1} sx={{ fontWeight: "bold" }}>
            {dialogItem?.product_name}
          </Typography>
          <input
            type="number"
            autoFocus
            value={dialogQty}
            onChange={(e) => setDialogQty(Number(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                confirmAddItem();
              }
            }}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogItem(null)}>Cancel</Button>
          <Button variant="contained" onClick={confirmAddItem}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
      >
        <DialogTitle>Complete Payment</DialogTitle>
        <DialogContent>
          <Typography variant="h6" mb={2}>
            Total Payable: Rs. {finalTotal.toFixed(2)}
          </Typography>
          <input
            autoFocus
            label="Cash From Customer (Rs.)"
            type="number"
            value={customerCash}
            onChange={(e) => setCustomerCash(e.target.value)}
            onKeyDown={(e) =>
              (e.key === "Enter" || (e.ctrlKey && e.key === "Enter")) &&
              confirmPayment()
            }
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          {balance !== null && (
            <Typography mt={2} variant="h6" color="green">
              Balance: Rs. {balance.toFixed(2)}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={confirmPayment}>
            Confirm Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
