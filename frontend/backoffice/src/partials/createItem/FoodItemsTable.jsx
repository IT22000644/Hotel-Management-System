import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "../../components/Button";
import axios from "axios";
import Modal from "react-modal";
import SearchBar from "../../components/SearchBar";

function FoodItemsTable() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [foodItems, setFoodItems] = useState([]);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    mainCategory: "",
    subCategory: "",
    price: "",
  });

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:5000/food-item");
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

  const handleCreateChange = (event) => {
    setNewItem({
      ...newItem,
      [event.target.name]: event.target.value,
    });
  };

  const handleCreateSave = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/food-item`,
        newItem
      );

      if (response.status === 200) {
        setCreateModalOpen(false);
        window.location.reload();
      } else {
        console.error("Failed to create item:", response);
      }
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const handleDelete = async (item) => {
    console.log(item._id);
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
        `http://localhost:5000/food-item/${selectedItem._id}`,
        selectedItem
      );

      if (response.status === 200) {
        // Update the items in your state here if needed
        setModalOpen(false);
        window.location.reload();
      } else {
        console.error("Failed to update item:", response);
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const onSubmit = async (data) => {
    console.log(data);

    try {
      console.log(JSON.stringify(data));

      data.imageUrl = "https://test.com/image.png";

      const response = await axios.post(
        "http://localhost:5000/food-item",
        data
      );
      console.log(response.data);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Manage Food Items</h1>
      <SearchBar alignment="left" />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button className="px-6" onClick={handleCreate}>
          Create Item
        </Button>
      </div>
      <hr className="border-t border-second_background mt-2 mb-12" />

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-t border-second_background">
            <th className="py-4 px-6 bg-second_background">Code</th>
            <th className="py-4 px-6 bg-second_background">Name</th>
            <th className="py-4 px-6 bg-second_background">Category</th>
            <th className="py-4 px-6 bg-second_background">Sub Category</th>
            <th className="py-4 px-6 bg-second_background">Price</th>
            <th className="py-4 px-6 bg-second_background">Actions</th>
          </tr>
        </thead>
        <tbody>
          {foodItems.map((item) => (
            <tr key={item._id} className="border-t border-second_background">
              <td className="py-4 px-6">{item.itemCode}</td>
              <td className="py-4 px-6">{item.name}</td>
              <td className="py-4 px-6">{item.mainCategory}</td>
              <td className="py-4 px-6">{item.subCategory}</td>
              <td className="py-4 px-6">{item.price}</td>
              <td className="py-4 px-6">
                <Button onClick={() => handleEdit(item)}>Edit</Button>
                <Button className="ml-2" onClick={() => handleDelete(item)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr className="border-t border-second_background mt-2 mb-12" />

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
            <h1 className="text-2xl font-bold text-black">Edit Food Items</h1>
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
              <label className="block text-sm font-medium">Category:</label>
              <select
                name="category"
                value={selectedItem.mainCategory}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
              >
                <option value="Appetizers">Appetizers</option>
                <option value="Main Courses">Main Courses</option>
                <option value="Desserts">Desserts</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>
            <div className="p-3">
              <label className="block text-sm font-medium">Sub Category:</label>
              <select
                name="subCategory"
                value={selectedItem.subCategory}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
              >
                <option value="">Select a sub category</option>
                <option value="Vegi">Vegi</option>
                <option value="Non-Vegi">Non-Vegi</option>
                <option value="Cocktail">Cocktail</option>
                <option value="Mocktail">Mocktail</option>
                <option value="Tea">Tea</option>
                <option value="Coffee">Coffee</option>
              </select>
            </div>
            <div className="p-3">
              <label className="block text-sm font-medium">Price:</label>
              <input
                type="text"
                name="price"
                value={selectedItem.price}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
              />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button type="submit" className="p-6">
                Save
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <Modal
        isOpen={isCreateModalOpen}
        onRequestClose={() => setCreateModalOpen(false)}
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
          <h1 className="text-2xl font-bold">Create Item</h1>
          <hr className="border-t border-second_background mt-2 mb-12" />

          <div>
            <label className="block text-sm font-medium">Item Code</label>
            <input
              {...register("itemCode", { required: "Item code is required" })}
              placeholder="Enter Item Code"
              className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
            />
            {errors.itemCode && (
              <p className="text-red-500">{errors.itemCode.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Item Name</label>
            <input
              {...register("name", { required: "Item name is required" })}
              placeholder="Enter Item Name"
              className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              {...register("mainCategory", {
                required: "Category is required",
              })}
              className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
            >
              <option value="">Select a Category</option>
              <option value="Appetizers">Appetizers</option>
              <option value="Main Courses">Main Courses</option>
              <option value="Desserts">Desserts</option>
              <option value="Beverages">Beverages</option>
            </select>
            {errors.mainCategory && (
              <p className="text-red-500">{errors.mainCategory.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              {...register("description", {
                required: "Description is required",
              })}
              placeholder="Description"
              className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
            />
            {errors.description && (
              <p className="text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Price</label>
            <input
              {...register("price", {
                required: "Price is required",
                valueAsNumber: true,
                min: { value: 0, message: "Price must be a positive number" },
              })}
              placeholder="Enter Price"
              className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
            />
            {errors.price && (
              <p className="text-red-500">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Sub Category</label>
            <select
              {...register("subCategory", {
                required: "Sub category is required",
              })}
              className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
            >
              <option value="">Select a Sub Category</option>
              <option value="Vegi">Vegi</option>
              <option value="Non-Vegi">Non-Vegi</option>
              <option value="Cocktail">Cocktail</option>
              <option value="Mocktail">Mocktail</option>
              <option value="Tea">Tea</option>
              <option value="Coffee">Coffee</option>
            </select>
            {errors.subCategory && (
              <p className="text-red-500">{errors.subCategory.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Product Image</label>
            <div className="relative mt-1 block w-full rounded-md border-second_background shadow-sm focus-within:border-button_color focus-within:ring focus-within:ring-color focus-within:ring-opacity-5">
              <input
                {...register("image", { required: "Image is required" })}
                type="file"
                id="default_size"
                className="block w-full text-sm text-hovered_text border border-second_background rounded-lg cursor-pointer bg-white dark:text-hidden_text focus:outline-none dark:bg-white dark:border-second_background dark:placeholder-color"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-button_color"></span>
            </div>
            {errors.image && (
              <p className="text-red-500">{errors.image.message}</p>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button>Create Item</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default FoodItemsTable;
