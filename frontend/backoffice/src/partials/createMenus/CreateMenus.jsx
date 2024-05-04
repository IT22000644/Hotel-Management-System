import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import Button from "../../components/Button";
import axios from "axios";
import Modal from "react-modal";

import { FaPlusSquare, FaMinusSquare } from "react-icons/fa";

function CreateMenu({ isOpen, toggleModal }) {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm();
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: "",
    type: "",
    status: "",
  });
  const [selectedFoodItems, setSelectedFoodItems] = useState([]);

  const handleChange = (event) => {
    setSelectedItem({
      ...selectedItem,
      [event.target.name]: event.target.value,
    });
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("type", data.type);
      formData.append("description", data.description);
      formData.append("image", data.image[0]); // append the image file
      formData.append("menuStatus", data.status);
      selectedFoodItems.forEach((item, index) => {
        formData.append(`foodItems[${index}]`, item);
      });
      const response = await axios.post(
        "http://localhost:5000/menu",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelect = () => {
    const selectedFoodItem = getValues("foodItem");
    if (!selectedFoodItems.includes(selectedFoodItem)) {
      setSelectedFoodItems([...selectedFoodItems, selectedFoodItem]);
    }
  };

  const handleDeselect = () => {
    const selectedFoodItem = getValues("foodItem");
    setSelectedFoodItems(
      selectedFoodItems.filter((item) => item !== selectedFoodItem)
    );
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={() => toggleModal()}
        style={{
          overlay: {
            zIndex: 1000,
          },
          content: {
            width: "50%",
            margin: "0 auto",
            backgroundColor: "#FFD600",
          },
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h1 className="text-2xl font-bold">Create Menu</h1>
          <hr className="border-t border-second_background mt-2 mb-12" />

          <div>
            <label className="block text-sm font-medium">Menu Name</label>
            <input
              {...register("name", { required: "Menu name is required" })}
              placeholder="Enter Menu Name"
              className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Type</label>
            <select
              {...register("type", { required: "Type is required" })}
              className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
            >
              <option value="">Select Type</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Special">Special</option>
              <option value="Kids">Kids</option>
            </select>
            {errors.type && (
              <p className="text-red-500">{errors.type.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              placeholder="Enter Description"
              className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
            />
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Image</label>
            <input
              type="file"
              {...register("image", { required: "Image is required" })}
              className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
            />
            {errors.image && (
              <p className="text-red-500">{errors.image.message}</p>
            )}
          </div>

          <div className="w-full bg-light_yellow rounded-xl shadow-lg overflow-hidden mb-5">
            <div className="md:flex-shrink-0 p-8">
              <div className="">
                <label className="block text-sm font-medium">
                  Select Food Items
                </label>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <select
                    {...register("foodItem", {
                      required: "Food Item is required",
                    })}
                    className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
                  >
                    <option value="">Select Food Item</option>
                    <option value="6624a14f4b332a79b24dc6a9">
                      Food Item 01
                    </option>
                    <option value="6634d4ca4c4b69fd076381d0">
                      Food Item 02
                    </option>
                    <option value="Food Item 03">Food Item 03</option>
                    <option value="Food Item 04">Food Item 04</option>
                  </select>
                  {errors.foodItem && (
                    <p className="text-red-500">{errors.foodItem.message}</p>
                  )}
                  <FaPlusSquare
                    onClick={handleSelect}
                    className="cursor-pointer text-button_color ml-4 mt-3"
                    size={30}
                  />
                </div>
              </div>

              <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden mb-5 mt-10">
                <div className="md:flex-shrink-0 p-8">
                  {selectedFoodItems.map((item, index) => (
                    <div
                      key={item._id}
                      className=" w-full bg-main_color rounded-xl shadow-lg overflow-hidden mb-5 mt-10 px-2 py-2"
                    >
                      <div
                        style={{
                          display: "flex",
                        }}
                      >
                        <span key={index} className="tag">
                          {item}
                          <FaMinusSquare
                            onClick={handleDeselect}
                            className="cursor-pointer text-button_color"
                            size={24}
                          />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              {...register("status", { required: "Status is required" })}
              className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Deactive">Deactive</option>
            </select>
            {errors.status && (
              <p className="text-red-500">{errors.status.message}</p>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button>Create Menu</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default CreateMenu;
