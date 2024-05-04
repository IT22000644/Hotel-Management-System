import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "../../components/Button";
import axios from "axios";
import Modal from "react-modal";
import SearchBar from "../../components/SearchBar";
import { FaPlusSquare } from "react-icons/fa";

function CreateMenu() {
  const {
    register,
    handleSubmit,
    watch,
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

  const handleCreateChange = (event) => {
    setNewItem({
      ...newItem,
      [event.target.name]: event.target.value,
    });
  };

  const handleCreateSave = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/menu`, newItem);

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

  const onSubmit = async (data) => {
    console.log(data);

    try {
      console.log(JSON.stringify(data));

      data.imageUrl = "https://test.com/image.png";

      const response = await axios.post("http://localhost:5000/menu", data);
      console.log(response.data);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleStatus = async (item) => {
    const newStatus = item.menuStatus === "Active" ? "Deactive" : "Active";
    try {
      const response = await axios.put(
        `http://localhost:5000/menu/${item._id}`,
        {
          ...item,
          menuStatus: newStatus,
        }
      );

      if (response.status === 200) {
        window.location.reload();
      } else {
        console.error("Failed to toggle status:", response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelect = () => {
    console.log("Select");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Manage Menus</h1>
      <SearchBar alignment="left" />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button className="px-6" onClick={handleCreate}>
          Create Menu
        </Button>
      </div>
      <hr className="border-t border-second_background mt-2 mb-12" />

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-t border-second_background">
            <th className="py-4 px-20 bg-second_background">Menu Name</th>
            <th className="py-4 px-20 bg-second_background">Type</th>
            <th className="py-4 px-20 bg-second_background">Status</th>
            <th className="py-4 px-20 bg-second_background">Actions</th>
          </tr>
        </thead>
        <tbody>
          {menus.map((item) => (
            <tr key={item._id} className="border-t border-second_background">
              <td className="py-4 px-20">{item.name}</td>
              <td className="py-4 px-20">{item.type}</td>
              <td className="py-4 px-20">{item.menuStatus}</td>
              <td className="py-4 px-20">
                <Button onClick={() => handleEdit(item)}>Edit</Button>
                <Button className="ml-2" onClick={() => handleDelete(item)}>
                  Delete
                </Button>
                <Button
                  className="ml-2"
                  onClick={() => handleToggleStatus(item)}
                >
                  {item.menuStatus === "Active" ? "Deactive" : "Active"}
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
                <select
                  {...register("foodItem", {
                    required: "Food Item is required",
                  })}
                  className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
                >
                  <option value="">Select Food Item</option>
                  <option value="Food Item 01">Food Item 01</option>
                  <option value="Food Item 02">Food Item 02</option>
                  <option value="Food Item 03">Food Item 03</option>
                  <option value="Food Item 04">Food Item 04</option>
                </select>
                {errors.foodItem && (
                  <p className="text-red-500">{errors.foodItem.message}</p>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                  }}
                >
                  <FaPlusSquare
                    onClick={handleSelect}
                    className="cursor-pointer text-button_color"
                    size={30}
                  />
                </div>
              </div>
              <div></div>
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
