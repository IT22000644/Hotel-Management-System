import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import Button from "../../components/Button";
import { toast } from "react-toastify";

function InvTable() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [foodItems, setFoodItems] = useState([]);
  const [decreaseQuantity, setDecreaseQuantity] = useState(0);
  const [isRestockModalOpen, setRestockModalOpen] = useState(false);
  const [increaseQuantity, setIncreaseQuantity] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "http://localhost:5000/restaurant-inventory"
        );
        setFoodItems(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoodItems();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleAdjust = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };
  const handleRestock = (item) => {
    setSelectedItem(item);
    setRestockModalOpen(true);
  };

  const handleIncrease = async () => {
    setSelectedItem((prevItem) => {
      const newQuantity = prevItem.quantity + increaseQuantity;
      return {
        ...prevItem,
        quantity: newQuantity,
      };
    });

    try {
      const response = await axios.put(
        `http://localhost:5000/restaurant-inventory/${selectedItem.foodItem?._id}`,
        {
          quantity: increaseQuantity,
        }
      );
      if (response.status === 200) {
        setRestockModalOpen(false);
        window.location.reload();
      } else {
        console.error("Failed to update item:", response);
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleDecrease = async () => {
    setSelectedItem((prevItem) => {
      const newQuantity =
        prevItem.quantity > decreaseQuantity
          ? prevItem.quantity - decreaseQuantity
          : 0;
      return {
        ...prevItem,
        quantity: newQuantity,
      };
    });

    try {
      const response = await axios.put(
        `http://localhost:5000/restaurant-inventory/${selectedItem.foodItem?._id}`,
        {
          quantity: -1 * decreaseQuantity,
        }
      );
      if (response.status === 200) {
        setModalOpen(false);
        window.location.reload();
      } else {
        console.error("Failed to update item:", response);
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleDelete = async (item) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/food-item/${item._id}`
      );
      if (response.status === 200) {
        window.location.reload();
      } else {
        console.error("Failed to delete item:", response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event) => {
    let value = parseInt(event.target.value);

    // Ensure the quantity is not less than zero for both fields
    if (value < 0) {
      value = 0;
      toast.error("Quantity cannot be less than zero");
    }

    // If the name of the input field is 'decreaseQuantity', ensure the quantity does not exceed the current quantity
    if (
      event.target.name === "decreaseQuantity" &&
      value > selectedItem.quantity
    ) {
      value = selectedItem.quantity;
      toast.error("Quantity cannot exceed the current quantity");
    }

    // Update the corresponding state based on the name of the input field
    if (event.target.name === "decreaseQuantity") {
      setDecreaseQuantity(value);
    } else if (event.target.name === "increaseQuantity") {
      setIncreaseQuantity(value);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5000/restaurant-inventory/${selectedItem._id}`,
        {
          ...selectedItem,
          quantity: selectedItem.quantity,
        }
      );
      if (response.status === 200) {
        setModalOpen(false);
        window.location.reload();
      } else {
        console.error("Failed to update item:", response);
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  return (
    <div>
      <select
        className="mt-5 mb-10 block w-1/3 rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Appetizers">Appetizers</option>
        <option value="Main Courses">Main Courses</option>
        <option value="Desserts">Desserts</option>
        <option value="Beverages">Beverages</option>
      </select>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-t border-second_background">
            <th className="py-4 px-6 bg-second_background">Item Code</th>
            <th className="py-4 px-6 bg-second_background">Item Name</th>
            <th className="py-4 px-6 bg-second_background">Image</th>
            <th className="py-4 px-6 bg-second_background">
              Remaining Quantity
            </th>
            <th className="py-4 px-6 bg-second_background">Actions</th>
          </tr>
        </thead>
        <tbody>
          {foodItems
            .filter(
              (item) =>
                selectedCategory === "All" ||
                item.foodItem?.mainCategory === selectedCategory
            )
            .map((item) => (
              <tr key={item._id} className="border-t border-second_background">
                <td className="py-4 px-6">{item.foodItem?.itemCode}</td>
                <td className="py-4 px-6">{item.foodItem?.name}</td>
                <td className="py-4 px-6">
                  <img
                    src={`http://localhost:5000/uploads/food/${item.foodItem?.imageUrl}`}
                    alt={item.foodItem?.name}
                    style={{ width: "50px", height: "50px" }}
                  />
                </td>
                <td className="py-4 px-6">{item.quantity}</td>
                <td className="py-4 px-6">
                  <Button onClick={() => handleAdjust(item)}>Adjust</Button>
                  <Button className="ml-2" onClick={() => handleRestock(item)}>
                    Restock
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setModalOpen(false)}
        style={{
          overlay: {
            zIndex: 1000,
          },
          content: {
            width: "50%", // 2/3 of the page
            margin: "0 auto", // center the form
            backgroundColor: "#FFD600",
            height: "fit-content",
          },
        }}
      >
        {selectedItem && (
          <form onSubmit={handleSave}>
            <h1 className="text-2xl font-bold text-black">
              Adjust Food Inventory
            </h1>
            <hr className="border-t border-white mt-3 mb-6" />
            <div className=" p-3 bg-light_yellow flex justify-between items-center mb-6 rounded">
              <div>
                <h2 className="text-xl font-bold">
                  {selectedItem.foodItem?.name}
                </h2>
                <p>Item Code: {selectedItem.foodItem?.itemCode}</p>
              </div>
              <img
                src={selectedItem.foodItem?.imageURL}
                alt={selectedItem.foodItem?.name}
                style={{ width: "100px", height: "100px" }}
              />
            </div>
            <div className="p-3">
              <label className="block text-sm font-medium">Quantity:</label>
              <div className="flex items-center">
                <input
                  type="number"
                  name="decreaseQuantity"
                  value={decreaseQuantity}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
                />
                <Button onClick={handleDecrease} className="mx-10">
                  Decrease
                </Button>
              </div>
            </div>
          </form>
        )}
      </Modal>
      <Modal
        isOpen={isRestockModalOpen}
        onRequestClose={() => setRestockModalOpen(false)}
        style={{
          overlay: {
            zIndex: 1000,
          },
          content: {
            width: "50%", // 2/3 of the page
            margin: "0 auto", // center the form
            backgroundColor: "#FFD600",
            height: "fit-content",
          },
        }}
      >
        {selectedItem && (
          <form onSubmit={handleSave}>
            <h1 className="text-2xl font-bold text-black">
              Restock Food Inventory
            </h1>
            <hr className="border-t border-white mt-3 mb-6" />
            <div className=" p-3 bg-light_yellow flex justify-between items-center mb-6 rounded">
              <div>
                <h2 className="text-xl font-bold">
                  {selectedItem.foodItem?.name}
                </h2>
                <p>Item Code: {selectedItem.foodItem?.itemCode}</p>
              </div>
              <img
                src={selectedItem.foodItem?.imageURL}
                alt={selectedItem.foodItem?.name}
                style={{ width: "100px", height: "100px" }}
              />
            </div>
            <div className="p-3">
              <label className="block text-sm font-medium">Quantity:</label>
              <div className="flex items-center">
                <input
                  type="number"
                  name="increaseQuantity"
                  value={increaseQuantity}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
                />
                <Button onClick={handleIncrease} className="mx-10">
                  Increase
                </Button>
              </div>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

export default InvTable;
