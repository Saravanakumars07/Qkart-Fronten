import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Box, Button, Stack, TextField, Typography, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import { config } from "../App";
import { getTotalCartValue } from "./Cart";
import "./Checkout.css";
import Cart from './Cart';
import Alert from "@mui/material/Alert";

const Checkout = () => {
  const history = useHistory();
  const token = localStorage.getItem("token");
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isAddNewAddress, setIsAddNewAddress] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/products`);
      setProducts(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  const getAddresses = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/user/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(response.data);
      setSelectedAddress("");
    } catch (e) {
      console.error(e);
    }
  };

  const getCartItemsWithDetails = () => {
    if (!items.length || !products.length) return [];
    return items.map((cartItem) => {
      const product = products.find(p => p._id === cartItem.productId);
      return {
        ...product,
        qty: cartItem.qty,
        productId: cartItem.productId
      };
    }).filter(item => item._id);
  };

  const addAddress = async () => {
    try {
      const response = await axios.post(
        `${config.endpoint}/user/addresses`,
        { address: newAddress },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAddresses(response.data);
      setNewAddress("");
      setIsAddNewAddress(false);
      if (response.data && response.data.length > 0) {
        setSelectedAddress(response.data[response.data.length - 1]._id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      await axios.delete(`${config.endpoint}/user/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedAddresses = addresses.filter((address) => address._id !== addressId);
      setAddresses(updatedAddresses);
      if (updatedAddresses && updatedAddresses.length > 0) {
        setSelectedAddress(updatedAddresses[0]._id);
      } else {
        setSelectedAddress("");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const validateRequest = () => {
    if (!selectedAddress) {
      setError("Please select one shipping address");
      return false;
    }
    const balance = Number(localStorage.getItem("balance"));
    if (balance < getTotalCartValue(getCartItemsWithDetails())) {
      setError("You do not have enough balance in your wallet");
      return false;
    }
    return true;
  };

  const performCheckout = async () => {
    if (!validateRequest()) return;
    try {
      await axios.post(
        `${config.endpoint}/cart/checkout`,
        { addressId: selectedAddress },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      history.push("/thanks");
    } catch (err) {
      setError("Error placing order");
    }
  };

  useEffect(() => {
    if (!token) {
      history.push("/login");
      alert('You must be logged in to access checkout page');
      return;
    }
    setIsLoggedIn(true);
    fetchProducts();
    fetchCart();
    getAddresses();
  }, [history, token]);

  if (!isLoggedIn) return null;

  return (
    <Box className="checkout-container">
      <Box className="shipping-section">
        <Typography variant="h4">Shipping</Typography>
        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}
        {addresses && addresses.length === 0 ? (
          <Typography> No addresses found for this account. Please add one to proceed </Typography>
        ) : (
          addresses.map((address) => (
            <Box key={address._id} className={`address-item ${selectedAddress === address._id ? 'selected' : 'not-selected'}`} onClick={() => setSelectedAddress(address._id)} >
              <Typography>{address.address}</Typography>
              <Button onClick={() => deleteAddress(address._id)}>DELETE</Button>
            </Box>
          ))
        )}
        {!isAddNewAddress ? (
          <Button variant="contained" onClick={() => setIsAddNewAddress(true)}> Add new address </Button>
        ) : (
          <Stack>
            <TextField multiline rows={4} placeholder="Enter your complete address" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} />
            <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={addAddress}> ADD </Button>
              <Button onClick={() => setIsAddNewAddress(false)}>CANCEL</Button>
            </Stack>
          </Stack>
        )}
        <Box className="payment-section">
          <Typography variant="h4">Payment</Typography>
          <Typography>Payment Method</Typography>
          <Typography>Wallet</Typography>
          <Cart items={getCartItemsWithDetails()} readonly={true} />
          <Typography> Pay ${getTotalCartValue(getCartItemsWithDetails())} of available $5000 </Typography>
          <Button variant="contained" onClick={performCheckout}> PLACE ORDER </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Checkout;