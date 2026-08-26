import React from "react";
import "./Sidebar.css";

import { assets } from "../../assets/assets";

import { NavLink } from "react-router-dom";

const Sidebar = () => {

    const adminLinks = [
        {
            path: "/add",
            icon: assets.add_icon,
            label: "Add Item"
        },
        {
            path: "/list",
            icon: assets.order_icon,
            label: "List Item"
        },
        {
            path: "/orders",
            icon: assets.order_icon,
            label: "Orders"
        }
    ];

    return (
        <div className="sidebar">

            <div className="sidebar-options">

                {adminLinks.map((item) => (

                    <NavLink
                        key={item.path}
                        to={item.path}
                        className="sidebar-option"
                    >

                        <img
                            src={item.icon}
                            alt=""
                        />

                        <p>
                            {item.label}
                        </p>

                    </NavLink>

                ))}

            </div>

        </div>
    );
};

export default Sidebar;