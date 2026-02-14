import React from "react";
import "./ProductCard.css";

const ProductCard = ({ name, price, description, image, category, rating }) => {
  return (
    <div className="product-card">
      <img src={image} alt={name} className="product-image" />
      <h2 className="product-name">{name}</h2>
      <p className="product-category">Category: {category}</p>
      <p className="product-description">{description}</p>
      <p className="product-price">${price}</p>
      <p className="product-rating">⭐ {rating} / 5</p>
      <button className="buy-button">Buy Now</button>
    </div>
  );
};

export default ProductCard;