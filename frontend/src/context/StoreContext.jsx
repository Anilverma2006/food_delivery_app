import axios from "axios";
import { createContext, useEffect } from "react";
import { useState } from "react";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:3000";
  const [food_list, setFoodlist] = useState([]);

  const [token, setToken] = useState("");

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if(token){
      await axios.post(url+"/api/card/add", {itemId}, {headers:{token}});
    }
  };

  const removeFromCard = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if(token){
      await axios.post(url+"/api/card/remove", {itemId}, {headers:{token}});
    }
  };


  const getTotalCartAmount = () => {
    let totalAmount = 0;

    for (const item in cartItems) {
      if (cartItems[item] > 0) {

        const itemInfo = food_list.find((product) => product._id === item);
        if(itemInfo){
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }

    return totalAmount;
};

  const fetchFoodlist = async()=>{
    const responce = await axios.get(url+"/api/food/list");
    setFoodlist(responce.data.data);
  }

  // const loadCardData = async (token)=>{
  //   const responce = await axios.post(url+"/api/card/get", {}, {headers:{token}})
  //   setCartItems(responce.data.cartItems);
  // }

  const loadCardData = async (token)=>{
    const responce = await axios.post(url+"/api/card/get", {}, {headers:{token}})
    setCartItems(responce.data.cartData);
}

  useEffect(()=>{
    async function loadData() {
      await fetchFoodlist();

      if(localStorage.getItem("token")){
        setToken(localStorage.getItem("token"));
        await loadCardData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCard,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
