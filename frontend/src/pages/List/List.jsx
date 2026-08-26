import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import { Salad } from "lucide-react";
const List = ({ url }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    const responce = await axios.get(`${url}/api/food/list`);

    if (responce.data.success) {
      // console.log(responce.data);
      setList(responce.data.data);
    } else {
      toast.error("Error");
    }
  };

  const removeFood = async (foodId) => {
    // const response = await axios.post(`${url}/api/food/remove`,{ id: foodId });

    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${url}/api/food/remove`,
      { id: foodId },
      {
        headers: {
          token: token,
        },
      },
    );
    await fetchList();

    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error("Error");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Foods List</p>

      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
      </div>
      {list.map((item, index) => {
        // console.log(item);
        return (
          <div key={index} className="list-table-format">
            {item.image ? <img src={item.image} alt="" /> : <Salad />}
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>${item.price}</p>
            <p onClick={() => removeFood(item._id)} className="curser">
              X
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default List;
