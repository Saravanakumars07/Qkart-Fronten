import { AddOutlined, RemoveOutlined, ShoppingCart } from "@mui/icons-material";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

const ItemQuantity = ({ value, handleAdd, handleDelete, readonly }) => {
  if (readonly) {
    return <Typography>Qty: {value}</Typography>;
  }
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" onClick={handleDelete}>
        <RemoveOutlined fontSize="small" />
      </IconButton>
      <Typography data-testid="item-qty">{value}</Typography>
      <IconButton size="small" onClick={handleAdd}>
        <AddOutlined fontSize="small" />
      </IconButton>
    </Stack>
  );
};



export const getTotalCartValue = (items = []) => {
  if (!items.length) return 0;

  return items.reduce((total, item) => {
    return total + item.qty * item.cost;
  }, 0);
};


const Cart = ({ items = [], handleQuantity, readonly, handleCheckout }) => {
  const history = useHistory();
  const cartItemsData = items;

  return (
    <Box>
      {cartItemsData.map((item) => (
        <Box display="flex" alignItems="flex-start" padding="1rem" key={item._id}>
          <Box className="image-container">
            <img src={item.image} alt={item.name} width="100%" height="100%" />
          </Box>
          <Box display="flex" flexDirection="column" justifyContent="space-between" height="6rem" paddingX="1rem">
            <div>{item.name}</div>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <ItemQuantity
                value={item.qty}
                handleAdd={() => handleQuantity(item._id, item.qty + 1)}
                handleDelete={() => handleQuantity(item._id, item.qty - 1)}
                readonly={readonly}
              />
              <Box padding="0.5rem" fontWeight="700" data-testid="cart-item-cost">
                ${item.cost}
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
      <Box padding="1rem" display="flex" justifyContent="space-between" alignItems="center">
        <Box color="#3C3C3C" alignSelf="center">
          Order total
        </Box>
        <Box color="#3C3C3C" fontWeight="700" fontSize="1.5rem" alignSelf="center" data-testid="cart-total">
          ${getTotalCartValue(cartItemsData)}
        </Box>
      </Box>
      {!readonly && (
        <Box display="flex" justifyContent="flex-end" className="cart-footer">
          <Button
            color="primary"
            variant="contained"
            startIcon={<ShoppingCart />}
            className="checkout-btn"
            onClick={() => history.push("/checkout")}
          >
            Checkout
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Cart;