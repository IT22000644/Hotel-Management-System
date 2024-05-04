import React, { useState, useEffect, useCallback } from "react";
import Button from "../../components/Button";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import axios from "axios";

const EditMenu = () => {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [menus, setMenus] = useState([]);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    type: "",
    status: "",
  });
  const [selectedFoodItems, setSelectedFoodItems] = useState([]);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:5000/menu");
        setMenus(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenus();
  }, []);

  if (isLoading) {
    return (
      <>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      </>
    );
  }

  const handleCreate = () => {
    setCreateModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (item) => {
    console.log(item._id);
    try {
      const response = await axios.delete(
        `http://localhost:5000/menu/${item._id}`
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
    setSelectedItem({
      ...selectedItem,
      [event.target.name]: event.target.value,
    });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    console.log(selectedItem._id);
    try {
      const response = await axios.put(
        `http://localhost:5000/menu/${selectedItem._id}`,
        selectedItem
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

  const handleSelect = () => {
    const selectedFoodItem = getValues("foodItem");
    setSelectedFoodItems([...selectedFoodItems, selectedFoodItem]);
  };

  const handleDeselect = () => {
    const selectedFoodItem = getValues("foodItem");
    setSelectedFoodItems(
      selectedFoodItems.filter((item) => item !== selectedFoodItem)
    );
  };

  return (
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
        },
      }}
    >
      {selectedItem && (
        <form onSubmit={handleSave}>
          <h1 className="text-2xl font-bold text-black">Edit Menu</h1>
          <hr className="border-t border-white mt-3 mb-6" />
          <div className="p-3">
            <label className="block text-sm font-medium">Name:</label>
            <input
              type="text"
              name="name"
              value={selectedItem.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
            />
          </div>
          <div className="p-3">
            <label className="block text-sm font-medium">Type:</label>
            <input
              type="text"
              name="type"
              value={selectedItem.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
            />
          </div>

          <div className="p-3">
            <label className="block text-sm font-medium">Description:</label>
            <textarea
              name="description"
              value={selectedItem.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
            />
          </div>

          <div className="p-3">
            <label className="block text-sm font-medium">Image:</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
            />
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button type="submit" className="pl-14 pr-14 mt-10">
              Save
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default EditMenu;
