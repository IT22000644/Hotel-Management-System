import React, { useState, useEffect } from "react";
import SearchBar from "../../components/SearchBar";
import axios from "axios";
import TabBar from "../../components/TabBar";
import Button from "../../components/Button";
import Modal from "react-modal";
import CustomModal from "../../components/PopUp";

Modal.setAppElement("#root");

function ManageTasksList() {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All Tasks");
  const [tab, setTab] = useState("All");
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/task");
        setTasks(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTasks();
  }, []);

  const handleDelete = (task) => {
    setSelectedTask(task);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/task/${selectedTask._id}`
      );
      if (response.status === 200) {
        setTasks(tasks.filter((t) => t._id !== selectedTask._id));
        setDeleteModalOpen(false);
      } else {
        console.error("Failed to delete task:", response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter !== "All Tasks" && task.__t !== filter) return false;
    if (tab !== "All" && task.status !== tab) return false;
    return true;
  });

  const handleSave = async (event) => {
    event.preventDefault();
    const updatedTasks = tasks.map((task) =>
      task.title === selectedTask.title ? selectedTask : task
    );

    // Split the date into endDate and endTime
    const endTime = new Date(selectedTask.endTime);

    const taskToUpdate = {
      ...selectedTask,
      endTime,
    };

    console.log(taskToUpdate);

    try {
      const response = await axios.put(
        `http://localhost:5000/task/${selectedTask._id}`,
        taskToUpdate
      );

      if (response.status === 200) {
        setModalOpen(false);
        window.location.reload();
      } else {
        console.error("Failed to update task:", response);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  function handleChange(event) {
    if (event.target.name === "deadline") {
      setSelectedTask((prevState) => ({
        ...prevState,
        endTime: new Date(event.target.value).toISOString(),
      }));
    } else {
      setSelectedTask((prevState) => ({
        ...prevState,
        [event.target.name]: event.target.value,
      }));
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
      <h1 className="text-2xl font-bold">Manage Tasks</h1>
      <SearchBar alignment="left" />

      <div className="flex space-x-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium">Task Type</label>
          <select
            onChange={(e) => setFilter(e.target.value)}
            className="mt-1 block w-1/2 rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
          >
            <option value="">All Tasks</option>
            <option value="Routine">Routine</option>
            <option value="HousekeepingTask">Housekeeping</option>
            <option value="Emergency">Emergency</option>
          </select>
        </div>
      </div>
      <div className="flex space-x-4 mt-8 mb-8">
        <TabBar
          tabs={["All", "Open", "Active", "Completed", "Escalate", "On Hold"]}
          activeTab={tab}
          onTabClick={setTab}
        />
      </div>
      {filteredTasks.map((task) => (
        <div
          key={task._id}
          className="w-full bg-second_background rounded-xl shadow-lg overflow-hidden mb-5"
        >
          <div className="md:flex-shrink-0 p-8">
            <div>
              <h2>Task Title: {task.title}</h2>
              <p>Task Type: {task.__t}</p>
              <p>Description: {task.description}</p>
              <p>Assignee: {task.userId?.name}</p>
              <p>Start Date: {new Date(task.startDate).toLocaleDateString()}</p>
              <p>End Date: {new Date(task.endDate).toLocaleDateString()}</p>
              <p>Status: {task.status}</p>
              <p>Priority: {task.urgencyLevel}</p>
              <p>Location: {task.roomId?.roomno}</p>
              <div className="flex justify-center">
                <Button
                  className="pl-14 pr-14"
                  onClick={() => handleEdit(task)}
                >
                  Edit
                </Button>
                {tab === "On Hold" && (
                  <Button
                    className="pl-14 pr-14 ml-4"
                    onClick={() => handleDelete(task)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
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
        {selectedTask && (
          <form onSubmit={handleSave}>
            <h1 className="text-2xl font-bold text-black">Edit Tasks</h1>
            <hr className="border-t border-white mt-3 mb-6" />

            <div className="p-3">
              <label className="block text-sm font-medium">Title:</label>
              <input
                type="text"
                name="title"
                value={selectedTask.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
              />
            </div>
            <div className="p-3">
              <label className="block text-sm font-medium">Type:</label>
              <input
                type="text"
                name="type"
                value={selectedTask.__t}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
              />
            </div>
            <div className="p-3">
              <label className="block text-sm font-medium">Deadline:</label>
              <input
                type="datetime-local"
                name="deadline"
                value={formatDate(selectedTask.endTime)}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
              />
            </div>
            <div className="p-3">
              <label className="block text-sm font-medium">Assignee:</label>
              <select
                name="assignee"
                value={selectedTask.userId?._id}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
              >
                <option value="">Select an assignee</option>
                <option value="66244ddc6fc5b531cea5b6ca">User 1</option>
                <option value="66244ddc6fc5b531cea5b6ca">User 2</option>
                <option value="66244ddc6fc5b531cea5b6ca">User 3</option>
                // Add more options as needed
              </select>
            </div>
            <div className="p-3">
              <label className="block text-sm font-medium">Status:</label>
              <select
                name="status"
                value={selectedTask.status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
              >
                <option value="">Select a status</option>
                <option value="Open">Open</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Escalated">Escalated</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button type="submit" className="p-3">
                Save
              </Button>
            </div>
          </form>
        )}
      </Modal>
      <CustomModal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setDeleteModalOpen(false)}
        title="Confirm Deletion"
        onConfirm={handleConfirmDelete}
      >
        Are you sure you want to delete this task?
      </CustomModal>
    </div>
  );
}

export default ManageTasksList;
