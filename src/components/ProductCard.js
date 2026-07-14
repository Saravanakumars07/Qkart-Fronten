import { 
  Card, 
  CardContent, 
  Typography, 
  Button 
 } from "@mui/material";

import React from "react";
import "./ProductCard.css";
import Rating from "@mui/material/Rating";
const ProductCard = ({ products, addToCart }) => {
  const handleAddToCart = () => {
    addToCart(products._id, 1, true);
  };

  return (
    <Card>
      <CardContent>
      <img src={products.image} alt={products.name} style={{ width: '100%', height: '150px', objectFit: 'contain' }} />
        
        <Typography variant="h6">{products.name}</Typography>
        <Typography variant="body2">{products.category}</Typography>
        {/* {products.category} */}
        <Rating value={products.rating} readOnly />
        <Typography variant="h6" color="primary" gutterBottom>
      ${products.cost}
      
    </Typography>
        {/* <Typography variant="h6">${products.cost}</Typography> */}
        <Button variant="contained" color="primary" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};


export default ProductCard;
