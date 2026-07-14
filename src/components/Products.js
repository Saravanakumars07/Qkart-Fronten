import { Search, SentimentDissatisfied } from "@mui/icons-material";
import { Typography, Grid, TextField, InputAdornment, CircularProgress } from '@mui/material';
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart from "./Cart";
import React, { useState, useEffect } from 'react';




const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  


  useEffect(() => {
    performAPICall();
  }, []);

  const performAPICall = async () => {

    setLoading(true);
    try {
      const response = await axios.get(`${config.endpoint}/products`);
      setProducts(response.data);
      setError(null);
      if (localStorage.getItem("token")) {
        fetchCart(response.data);
      }
    } catch (e) {
      setProducts([]);
      setError("Could not fetch products. Check that the backend is running, reachable and returns valid JSON.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async (productsData) => {
    try {
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const cartItemsData = generateCartItemsFrom(response.data, productsData);
      setCartItems(cartItemsData);
    } catch (e) {
      console.error(e);
    }
  };

  const generateCartItemsFrom = (cartData, productsData) => {
    return cartData.map((cartItem) => {
      const product = productsData.find((p) => p._id === cartItem.productId);
      return { ...product, qty: cartItem.qty };
    });
  };

  const performSearch = async (text) => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.endpoint}/products/search?value=${text}`);
      setProducts(response.data);
      setError(null);
    } catch (e) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const debounceSearch = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchText === "") {
        performAPICall();
      } else {
        performSearch(searchText);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchText]);

  const addToCart = async (productId, qty = 1) => {
    const token = localStorage.getItem("token");

    if (!token) {
     enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
      return;
    }
    const existingItem = cartItems.find(
      (item) => item._id === productId
    );
    if (existingItem) {
      enqueueSnackbar("Item already in cart", {
        variant: "warning",
      });
      return;
    }
    
    try {
      const response = await axios.post(
        `${config.endpoint}/cart`,
        { productId, qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(generateCartItemsFrom(response.data, products));
    } catch (e) {
      console.error(e);
      enqueueSnackbar("Failed to add item to cart", { variant: "error" });
    }
  };


  const handleQuantity = async (productId, qty) => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      await axios.post(
        `${config.endpoint}/cart`,
        {
          productId,
          qty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let updatedCart;

      if (qty === 0) {
       updatedCart = cartItems.filter(
          (item) => item._id !== productId
        );
      } else {
        updatedCart = cartItems.map((item) => {
          if (item._id === productId) {
            return {
              ...item,
              qty,
            };
          }
  
          return item;
        });
      }
  
      setCartItems(updatedCart);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <Header>
        <TextField
          className="search-desktop"
          size="small"
          placeholder="Search for items/categories"
          value={searchText}
          onChange={debounceSearch}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
        />
      </Header>
      
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        placeholder="Search for items/categories"
        value={searchText}
        onChange={debounceSearch}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
      />
      <Grid container>
        <Grid item xs={12} md={9} className="product-grid">
          <Box className="hero">
            <p className="hero-heading"> India’s <span className="hero-highlight">FASTEST DELIVERY</span> to your door step </p>
          </Box>

          {loading ? (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{ minHeight: "30vh" }}>
              <CircularProgress />
              <Typography variant="h6" mt={1}> Loading products... </Typography>
            </Box>
          ) : products.length === 0 ? (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{ minHeight: "30vh" }}>
              <SentimentDissatisfied />
              <Typography variant="h6">No products found</Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {products.map((product) => (
                <Grid item xs={6} md={3} key={product._id}>
                  <ProductCard products={product} addToCart={addToCart} />
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
        {localStorage.getItem("token") && (
          <Grid item xs={12} md={3}>
            <Cart items={cartItems} handleQuantity={handleQuantity} />
          </Grid>
        )}
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
