import { useState, useEffect } from "react";
import Button from "../../components/Button";
import Modal from "react-modal";
import axios from "axios";
import SearchBar from "../../components/SearchBar";

function TasksTable() {
  const [tasks, setTasks] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:5000/task");
        setTasks(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks(); // Call the function
  }, []);

  if (isLoading) {
    return (
      <>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
        ;
      </>
    );
  }

  const handleDelete = async (task) => {
    console.log(task._id);
    try {
      const response = await axios.delete(
        `http://localhost:5000/task/${task._id}`
      );
      if (response.status === 200) {
        window.location.reload();
      } else {
        console.error("Failed to delete task:", response);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const genReport = async () => {
    try {
      const response = await axios.get("http://localhost:5000/report/tasks", {
        responseType: "arraybuffer",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Extract filename from the 'Content-Disposition' header
      const contentDisposition =
        response.headers["content-disposition"] ||
        response.headers["Content-Disposition"];
      let filename = "file.xlsx"; // Default filename in case extraction fails
      console.log(contentDisposition);
      if (contentDisposition) {
        const regex = /filename="([^"]*)"/;
        const match = contentDisposition.match(regex);
        filename = match ? match[1] : filename;
      }

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Monitor Tasks</h1>
      <SearchBar alignment="left" />
      <hr className="border-t border-second_background mt-2 mb-12" />
      <table className="w-full text-left border-collapse">
        <thead className="border-t border-second_background">
          <tr className="bg-second_background">
            <th className="py-4 px-6">Task Title</th>
            <th className="py-4 px-6">Task Type</th>
            <th className="py-4 px-6">Task Deadline</th>
            <th className="py-4 px-6">Assignee</th>
            <th className="py-4 px-6">Task Status</th>
            <th className="py-4 px-6">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={index} className="border-t border-second_background">
              <td className="py-4 px-6">{task.title}</td>
              <td className="py-4 px-6">{task.__t}</td>
              <td className="py-4 px-6">
                {new Date(task.endTime).toLocaleDateString()}
              </td>
              <td className="py-4 px-6">{task.userId?.name}</td>
              <td className="py-4 px-6">{task.status}</td>
              <td className="py-4 px-6">
                <Button className="ml-2" onClick={() => handleDelete(task)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr className="border-t border-second_background mt-2 mb-12" />

      <Button className="mt-3 mb-2" onClick={() => genReport()}>
        Generate Report
      </Button>
    </div>
  );
}

export default TasksTable;
