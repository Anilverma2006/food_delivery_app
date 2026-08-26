import React, { useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { CirclePlus } from "lucide-react";

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCard, url } =
    useContext(StoreContext);

  const itemCount = cartItems?.[id] || 0;

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        {/* <img
          className="food-item-image"
          src={
            image?.startsWith("http")
              ? image
              : url + "/images/" + image
          }
          alt={name}
        /> */}

        <img
          className="food-item-image"
          src={image.startsWith("http") ? image : url + "/images/" + image}
          alt=""
        />

        {itemCount === 0 ? (
          <button
            className="food-item-add-btn"
            onClick={() => addToCart(id)}
            style={{ padding: "0px", width: "40px", height: "40px" }}
          >
            {/* <img
              src={assets.add_icon_white}
              alt="Add"
            /> */}
            <CirclePlus size={30} style={{ color: "#383838" }} />
          </button>
        ) : (
          <div className="food-item-counter">
            <button type="button" onClick={() => removeFromCard(id)}>
              <img src={assets.remove_icon_red} alt="Remove" />
            </button>

            <p>{itemCount}</p>

            <button type="button" onClick={() => addToCart(id)}>
              <img src={assets.add_icon_green} alt="Add" />
            </button>
          </div>
        )}
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p className="food-item-name">{name}</p>

          <img
            src={assets.rating_starts}
            alt="Rating"
            className="food-item-rating"
          />
        </div>

        <p className="food-item-desc">{description}</p>

        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
