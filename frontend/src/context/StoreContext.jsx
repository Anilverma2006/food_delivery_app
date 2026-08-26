import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);


const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});

    const [food_list, setFoodlist] = useState([]);

    const [token, setToken] = useState("");

    const [role, setRole] = useState("");

    const [user, setUser] = useState(null);

const [authLoading, setAuthLoading] = useState(true);
const [authFailed, setAuthFailed] = useState(false);
const [authChecked, setAuthChecked] = useState(false);

    const url = "http://localhost:3000";


    // -----------------------------------
    // CLEAR AUTHENTICATION
    // -----------------------------------

    const clearAuthentication = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        setToken("");
        setRole("");
        setUser(null);

        setCartItems({});
    };


    // -----------------------------------
    // ADD TO CART
    // -----------------------------------

    const addToCart = async (itemId) => {

        if (!cartItems[itemId]) {

            setCartItems((prev) => ({
                ...prev,
                [itemId]: 1
            }));

        } else {

            setCartItems((prev) => ({
                ...prev,
                [itemId]: prev[itemId] + 1
            }));
        }


        if (token) {

            try {

                await axios.post(
                    url + "/api/card/add",
                    { itemId },
                    {
                        headers: {
                            token
                        }
                    }
                );

            } catch (error) {

                console.log("Add to cart error:", error);

            }
        }
    };


    // -----------------------------------
    // REMOVE FROM CART
    // -----------------------------------

    const removeFromCard = async (itemId) => {

        setCartItems((prev) => ({
            ...prev,
            [itemId]: prev[itemId] - 1
        }));


        if (token) {

            try {

                await axios.post(
                    url + "/api/card/remove",
                    { itemId },
                    {
                        headers: {
                            token
                        }
                    }
                );

            } catch (error) {

                console.log("Remove from cart error:", error);

            }
        }
    };


    // -----------------------------------
    // TOTAL CART
    // -----------------------------------

    const getTotalCartAmount = () => {

        let totalAmount = 0;


        for (const item in cartItems) {

            if (cartItems[item] > 0) {

                const itemInfo = food_list.find(
                    (product) => product._id === item
                );


                if (itemInfo) {

                    totalAmount +=
                        itemInfo.price * cartItems[item];
                }
            }
        }


        return totalAmount;
    };


    // -----------------------------------
    // FOOD LIST
    // -----------------------------------

    const fetchFoodlist = async () => {

        try {

            const response = await axios.get(
                url + "/api/food/list"
            );

            setFoodlist(response.data.data);

        } catch (error) {

            console.log(
                "Food list error:",
                error
            );
        }
    };


    // -----------------------------------
    // LOAD CART
    // -----------------------------------

    const loadCardData = async (userToken) => {

        try {

            const response = await axios.post(
                url + "/api/card/get",
                {},
                {
                    headers: {
                        token: userToken
                    }
                }
            );


            if (response.data.success === false) {

                throw new Error(
                    "Unable to load cart"
                );
            }


            setCartItems(
                response.data.cartData || {}
            );

        } catch (error) {

            console.log(
                "Cart loading error:",
                error
            );

            // Don't immediately logout here.
            // Authentication is already validated
            // separately by getuser.
        }
    };


    // -----------------------------------
    // GET CURRENT USER
    // -----------------------------------

    const getCurrentUser = async (userToken) => {

        try {

            const response = await axios.get(
                url + "/api/user/getuser",
                {
                    headers: {
                        token: userToken
                    }
                }
            );


            if (!response.data.success) {

                throw new Error(
                    response.data.message ||
                    "User not found"
                );
            }


            const currentUser = response.data.user;


            if (!currentUser) {

                throw new Error(
                    "User data not found"
                );
            }


            // --------------------------------
            // UPDATE USER STATE
            // --------------------------------

            setUser(currentUser);


            // --------------------------------
            // UPDATE ROLE
            // --------------------------------

            const userRole =
                currentUser.role || "user";

            setRole(userRole);

            localStorage.setItem(
                "role",
                userRole
            );


            // --------------------------------
            // KEEP TOKEN
            // --------------------------------

            setToken(userToken);

            localStorage.setItem(
                "token",
                userToken
            );


            return currentUser;

        } catch (error) {

            console.log(
                "Get current user failed:",
                error
            );

            clearAuthentication();
            setAuthFailed(true);
            return null;
        }
    };


    // -----------------------------------
    // INITIAL APPLICATION LOAD
    // -----------------------------------

    useEffect(() => {

        const loadData = async () => {

            setAuthLoading(true);


            try {

                // Food can load independently
                await fetchFoodlist();


                const storedToken =
                    localStorage.getItem("token");


                // --------------------------------
                // NO TOKEN
                // --------------------------------

                if (!storedToken) {

                    setToken("");
                    setRole("");
                    setUser(null);
                    setAuthFailed(false);
                    return;
                }


                // --------------------------------
                // TOKEN EXISTS
                // VERIFY TOKEN + USER
                // --------------------------------

                const currentUser =
                    await getCurrentUser(
                        storedToken
                    );


                // --------------------------------
                // USER VALID
                // --------------------------------

                if (currentUser) {

                    await loadCardData(
                        storedToken
                    );
                }

            } catch (error) {

                console.log(
                    "Application loading error:",
                    error
                );

                clearAuthentication();
            }finally {

    setAuthLoading(false);

    setAuthChecked(true);
}
        };


        loadData();

    }, []);


    // -----------------------------------
    // CONTEXT VALUE
    // -----------------------------------

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

        role,

        setRole,

        user,

        setUser,

        authLoading,
        authChecked,

        clearAuthentication,

        getCurrentUser
    };


    return (

        <StoreContext.Provider value={contextValue}>

            {props.children}

        </StoreContext.Provider>
    );
};


export default StoreContextProvider;