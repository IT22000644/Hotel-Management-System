import React, { useState, useEffect, useCallback } from "react";
import Button from "../../components/Button";
import Modal from "react-modal";
import { useForm } from "react-hook-form";
import axios from "axios";

const EditMenu = ({
  editedItem,
  setEditedItem,
  isEditModalOpen,
  setIsEditModalOpen,
}) => {
  const {
    getValues,
    formState: { errors },
  } = useForm();

  const [selectedFoodItems, setSelectedFoodItems] = useState([]);

  const [file, setFile] = useState(null);

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", editedItem.name);
      formData.append("type", editedItem.type);
      formData.append("description", editedItem.description);
      if (file) {
        formData.append("image", file);
      }
      selectedFoodItems.forEach((item, index) => {
        formData.append(`foodItems[${index}]`, item);
      });

      const response = await axios.put(
        `http://localhost:5000/menu/${editedItem._id}`,
        formData
      );

      if (response.status === 200) {
        setIsEditModalOpen(false);
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

  const handleChange = (event) => {
    if (event.target.name === "image") {
      setFile(event.target.files[0]);
    } else {
      setEditedItem({
        ...editedItem,
        [event.target.name]: event.target.value,
      });
    }
  };

  return (
    <Modal
      isOpen={isEditModalOpen}
      onRequestClose={() => setIsEditModalOpen(false)}
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
      {editedItem && (
        <form onSubmit={handleSave}>
          <h1 className="text-2xl font-bold text-black">Edit Menu</h1>
          <hr className="border-t border-white mt-3 mb-6" />
          <div className="p-3">
            <label className="block text-sm font-medium">Name:</label>
            <input
              type="text"
              name="name"
              value={editedItem.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
            />
          </div>
          <div className="p-3">
            <label className="block text-sm font-medium">Type:</label>
            <input
              type="text"
              name="type"
              value={editedItem.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
            />
          </div>

          <div className="p-3">
            <label className="block text-sm font-medium">Description:</label>
            <textarea
              name="description"
              value={editedItem.description}
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
