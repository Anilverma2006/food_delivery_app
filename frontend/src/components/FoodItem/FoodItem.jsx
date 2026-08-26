import React, { useContext, useState } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ id, name, price, description, image }) => {
  // const [itemCount, setItemCount] = useState(0);
  const { cartItems, setCartItems, addToCart, removeFromCard, url } =
    useContext(StoreContext);

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img
          className="food-item-image"
          src={image?.startsWith("http") ? image : url + "/images/" + image}
          alt={name}
        />
        {!cartItems?.[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
          ></img>
        ) : (
          <div className="food-item-counter">
            <img
              onClick={() => removeFromCard(id)}
              src={assets.remove_icon_red}
              alt=""
            />
            <p>{cartItems?.[id]}</p>
            <img
              onClick={() => addToCart(id)}
              src={assets.add_icon_green}
              alt=""
            />
          </div>
        )}
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="" />
        </div>

        <p className="food-item-desc">{description}</p>

        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
