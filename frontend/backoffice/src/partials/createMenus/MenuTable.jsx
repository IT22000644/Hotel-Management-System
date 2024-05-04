import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import Button from "../../components/Button";
import axios from "axios";
import Modal from "react-modal";
import SearchBar from "../../components/SearchBar";
import { FaPlusSquare, FaMinusSquare } from "react-icons/fa";
import EditMenu from "./EditMenu";

const MenuTable = () => {
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedItem, setEditedItem] = useState(null);

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditedItem(item);
    setIsEditModalOpen(true);
  };

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

  return (
    <>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-t border-second_background">
            <th className="py-4 px-16 bg-second_background">Menu Name</th>
            <th className="py-4 px-16 bg-second_background">Type</th>
            <th className="py-4 px-16 bg-second_background">Status</th>
            <th className="py-4 px-16 bg-second_background">Actions</th>
          </tr>
        </thead>
        <tbody>
          {menus.map((item) => (
            <tr key={item._id} className="border-t border-second_background">
              <td className="py-4 px-16">{item.name}</td>
              <td className="py-4 px-16">{item.type}</td>
              <td className="py-4 px-16">{item.menuStatus}</td>
              <td className="py-4 px-16">
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
      <EditMenu
        selectedItem={selectedItem}
        editedItem={editedItem}
        setEditedItem={setEditedItem}
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
      />
      <hr className="border-t border-second_background mt-2 mb-12" />
    </>
  );
};

export default MenuTable;
