import axios from "axios";
import {
    createContext,
    useEffect,
    useState
} from "react";


export const StoreContext =
    createContext(null);


const TOKEN_KEY = "token";
const ROLE_KEY = "role";


const apiUrl =
    import.meta.env.VITE_API_URL?.replace(
        /\/$/,
        ""
    );


if (!apiUrl) {
    throw new Error(
        "VITE_API_URL is not configured."
    );
}


const StoreContextProvider = (props) => {

    // --------------------------------------------
    // AUTH STATE
    // --------------------------------------------

    const [token, setToken] =
        useState(() =>
            localStorage.getItem(TOKEN_KEY) || ""
        );


    const [role, setRole] =
        useState(() =>
            localStorage.getItem(ROLE_KEY) || ""
        );


    const [user, setUser] =
        useState(null);


    const [authStatus, setAuthStatus] =
        useState("loading");


    // --------------------------------------------
    // FOOD
    // --------------------------------------------

    const [food_list, setFoodlist] =
        useState([]);


    // --------------------------------------------
    // CART
    // --------------------------------------------

    const [cartItems, setCartItems] =
        useState({});


    // --------------------------------------------
    // CLEAR AUTH
    // --------------------------------------------

    const clearAuthentication = () => {

        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(ROLE_KEY);

        setToken("");
        setRole("");
        setUser(null);

        setCartItems({});

        setAuthStatus(
            "unauthenticated"
        );
    };


    // --------------------------------------------
    // SAVE AUTH SESSION
    // --------------------------------------------

    const saveAuthentication = (
        newToken,
        currentUser
    ) => {

        const userRole =
            currentUser?.role || "user";


        localStorage.setItem(
            TOKEN_KEY,
            newToken
        );


        localStorage.setItem(
            ROLE_KEY,
            userRole
        );


        setToken(newToken);
        setRole(userRole);
        setUser(currentUser);
        setAuthStatus("authenticated");
    };


    // --------------------------------------------
    // GET CURRENT USER
    // --------------------------------------------

    const getCurrentUser = async (
        storedToken
    ) => {

        try {

            const response =
                await axios.get(
                    `${apiUrl}/api/user/getuser`,
                    {
                        headers: {
                            token: storedToken
                        }
                    }
                );


            if (
                !response.data?.success ||
                !response.data?.user
            ) {

                throw new Error(
                    response.data?.message ||
                    "Unable to validate user."
                );
            }


            const currentUser =
                response.data.user;


            const currentRole =
                currentUser.role || "user";


            // --------------------------------
            // USER FROM BACKEND IS AUTHORITATIVE
            // --------------------------------

            localStorage.setItem(
                TOKEN_KEY,
                storedToken
            );

            localStorage.setItem(
                ROLE_KEY,
                currentRole
            );


            setToken(storedToken);
            setRole(currentRole);
            setUser(currentUser);

            setAuthStatus(
                "authenticated"
            );


            return currentUser;

        } catch (error) {

            console.error(
                "User validation failed:",
                error
            );


            // Token invalid
            // User deleted
            // API unavailable
            // Any authentication API failure
            // => logout completely

            clearAuthentication();

            return null;
        }
    };


    // --------------------------------------------
    // LOGIN / REGISTER
    // --------------------------------------------

    const authenticateUser = async (
        mode,
        data
    ) => {

        const endpoint =
            mode === "login"
                ? "/api/user/login"
                : "/api/user/register";


        try {

            const response =
                await axios.post(
                    `${apiUrl}${endpoint}`,
                    data
                );


            if (
                !response.data?.success
            ) {

                return {
                    success: false,
                    message:
                        response.data?.message ||
                        "Authentication failed."
                };
            }


            const newToken =
                response.data.token;


            const currentUser =
                response.data.user;


            if (
                !newToken ||
                !currentUser
            ) {

                return {
                    success: false,
                    message:
                        "Invalid response from server."
                };
            }


            saveAuthentication(
                newToken,
                currentUser
            );


            // Load user's cart after authentication
            await loadCardData(
                newToken
            );


            return {
                success: true,
                token: newToken,
                user: currentUser
            };

        } catch (error) {

            console.error(
                "Authentication request failed:",
                error
            );


            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Unable to connect to the server."
            };
        }
    };


    // --------------------------------------------
    // FOOD LIST
    // --------------------------------------------

    const fetchFoodlist = async () => {

        try {

            const response =
                await axios.get(
                    `${apiUrl}/api/food/list`
                );


            if (
                response.data?.success === false
            ) {
                throw new Error(
                    response.data?.message ||
                    "Unable to load food."
                );
            }


            setFoodlist(
                response.data?.data || []
            );

        } catch (error) {

            console.error(
                "Food list error:",
                error
            );

            setFoodlist([]);
        }
    };


    // --------------------------------------------
    // LOAD CART
    // --------------------------------------------

    const loadCardData = async (
        userToken
    ) => {

        try {

            const response =
                await axios.post(
                    `${apiUrl}/api/card/get`,
                    {},
                    {
                        headers: {
                            token: userToken
                        }
                    }
                );


            if (
                response.data?.success === false
            ) {

                throw new Error(
                    response.data?.message ||
                    "Unable to load cart."
                );
            }


            setCartItems(
                response.data?.cartData || {}
            );

        } catch (error) {

            console.error(
                "Cart loading error:",
                error
            );

            // Cart failure is NOT treated as
            // authentication failure.
            //
            // Authentication was already validated
            // separately by /getuser.

            setCartItems({});
        }
    };


    // --------------------------------------------
    // ADD TO CART
    // --------------------------------------------

    const addToCart = async (
        itemId
    ) => {

        setCartItems((prev) => {

            if (!prev[itemId]) {

                return {
                    ...prev,
                    [itemId]: 1
                };
            }


            return {
                ...prev,
                [itemId]:
                    prev[itemId] + 1
            };
        });


        if (!token) {
            return;
        }


        try {

            await axios.post(
                `${apiUrl}/api/card/add`,
                { itemId },
                {
                    headers: {
                        token
                    }
                }
            );

        } catch (error) {

            console.error(
                "Add to cart error:",
                error
            );
        }
    };


    // --------------------------------------------
    // REMOVE FROM CART
    // --------------------------------------------

    const removeFromCard = async (
        itemId
    ) => {

        setCartItems((prev) => {

            const currentQuantity =
                prev[itemId] || 0;


            if (
                currentQuantity <= 1
            ) {

                const updated = {
                    ...prev
                };

                delete updated[itemId];

                return updated;
            }


            return {
                ...prev,
                [itemId]:
                    currentQuantity - 1
            };
        });


        if (!token) {
            return;
        }


        try {

            await axios.post(
                `${apiUrl}/api/card/remove`,
                { itemId },
                {
                    headers: {
                        token
                    }
                }
            );

        } catch (error) {

            console.error(
                "Remove from cart error:",
                error
            );
        }
    };


    // --------------------------------------------
    // TOTAL CART AMOUNT
    // --------------------------------------------

    const getTotalCartAmount = () => {

        let totalAmount = 0;


        for (
            const item in cartItems
        ) {

            if (
                cartItems[item] <= 0
            ) {
                continue;
            }


            const itemInfo =
                food_list.find(
                    (product) =>
                        product._id === item
                );


            if (itemInfo) {

                totalAmount +=
                    itemInfo.price *
                    cartItems[item];
            }
        }


        return totalAmount;
    };


    // --------------------------------------------
    // INITIAL AUTHENTICATION CHECK
    // --------------------------------------------

    useEffect(() => {

        const initializeApplication =
            async () => {

                setAuthStatus(
                    "loading"
                );


                const storedToken =
                    localStorage.getItem(
                        TOKEN_KEY
                    );


                // --------------------------------
                // ALWAYS LOAD FOOD
                // --------------------------------

                fetchFoodlist();


                // --------------------------------
                // NO TOKEN
                // --------------------------------

                if (!storedToken) {

                    setToken("");
                    setRole("");
                    setUser(null);
                    setCartItems({});

                    setAuthStatus(
                        "unauthenticated"
                    );

                    return;
                }


                // --------------------------------
                // TOKEN EXISTS
                // VALIDATE WITH BACKEND
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
            };


        initializeApplication();

    }, []);


    // --------------------------------------------
    // CONTEXT
    // --------------------------------------------

    const contextValue = {

        food_list,

        cartItems,
        setCartItems,

        addToCart,
        removeFromCard,

        getTotalCartAmount,

        url: apiUrl,

        token,
        setToken,

        role,
        setRole,

        user,
        setUser,

        authStatus,

        authenticateUser,
        getCurrentUser,

        clearAuthentication
    };


    return (
        <StoreContext.Provider
            value={contextValue}
        >
            {props.children}
        </StoreContext.Provider>
    );
};


export default StoreContextProvider;