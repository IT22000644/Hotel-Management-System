import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import axios from "axios";

function CreateTaskForm() {
  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { errors },
  } = useForm();
  const watchStartDate = watch("startDate");
  const watchStartTime = watch("startTime");
  const watchEndDate = watch("endDate");
  const watchEndTime = watch("endTime");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [assets, setAssets] = useState([]);
  const [users, setUsers] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:5000/asset");
        console.log(response.data);
        setAssets(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:5000/user");
        const maintenanceUsers = response.data.filter(
          (user) => user.department === "Maintenance Department"
        );
        setUsers(maintenanceUsers);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:5000/room");
        console.log(response.data);
        setLocations(response.data.Rooms);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const onSubmit = async (data) => {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const startTime = new Date(
      startDate.setHours(
        data.startTime.split(":")[0],
        data.startTime.split(":")[1]
      )
    );
    const endTime = new Date(
      endDate.setHours(data.endTime.split(":")[0], data.endTime.split(":")[1])
    );

    if (
      startDate.toDateString() === endDate.toDateString() &&
      startTime >= endTime
    ) {
      alert("On the same day, the end time must be after the start time");
      return;
    } else if (startDate > endDate) {
      alert("Start date must be less than end date");
      return;
    }

    if (data.taskType === "Housekeeping ") {
      data.roomId = data.location;
    }

    const taskData = {
      ...data,
      startTime,
      endTime,
    };

    try {
      console.log(JSON.stringify(taskData));

      const response = await axios.post("http://localhost:5000/task", taskData);
      console.log(response.data);
      navigate("/maintenance/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  if (assets.length === 0 || users.length === 0 || locations.length === 0) {
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h1 className="text-2xl font-bold">Create Task</h1>
      <hr className="border-t border-second_background mt-2 mb-12" />

      <div>
        <label className="block text-sm font-medium">Task title</label>
        <input
          {...register("title", { required: "Title is required" })}
          placeholder="Enter Title"
          className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      </div>

      <div className="flex space-x-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium">Task Type</label>
          <select
            {...register("taskType", { required: "Task type is required" })}
            className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
          >
            <option value="">Select a task type</option>
            <option value="Routine">Routine</option>
            <option value="Housekeeping">Housekeeping</option>
            <option value="Emergency">Emegerncy</option>
          </select>
          {errors.taskType && (
            <p className="text-red-500">{errors.taskType.message}</p>
          )}
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="w-1/3">
          <label className="block text-sm font-medium">Start Date</label>
          <input
            {...register("startDate", {
              required: "Start date is required",
              validate: (value) =>
                new Date(value) >= new Date().setHours(0, 0, 0, 0) ||
                "Start date must be current or future date",
            })}
            type="date"
            className="mt-1 block w-full rounded-md border-second_background shadow-sm  focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
          />
          {errors.startDate && (
            <p className="text-red-500">{errors.startDate.message}</p>
          )}
        </div>
        <div className="w-1/3">
          <label className="block text-sm font-medium">Start Time</label>
          <input
            {...register("startTime", { required: "Start time is required" })}
            type="time"
            className="mt-1 block w-full rounded-md border-second_background shadow-sm  focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
          />
          {errors.startTime && (
            <p className="text-red-500">{errors.startTime.message}</p>
          )}
        </div>

        <div className="w-1/3">
          <label className="block text-sm font-medium">End Date</label>
          <input
            {...register("endDate", {
              required: "End date is required",
              validate: {
                validDate: (value) =>
                  new Date(value) >= new Date().setHours(0, 0, 0, 0) ||
                  "End date must be current or future date",
                compare: (value) =>
                  new Date(value) >= new Date(getValues("startDate")) ||
                  "End date must be on or after start date",
              },
            })}
            type="date"
            className="mt-1 block w-full rounded-md border-second_background shadow-sm  focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
          />
          {errors.endDate && (
            <p className="text-red-500">{errors.endDate.message}</p>
          )}
        </div>

        <div className="w-1/3">
          <label className="block text-sm font-medium">End Time</label>
          <input
            {...register("endTime", {
              required: "End time is required",
              validate: (value) => {
                const startDate = new Date(getValues("startDate"));
                const endDate = new Date(getValues("endDate"));
                const startTime = new Date(
                  startDate.setHours(
                    getValues("startTime").split(":")[0],
                    getValues("startTime").split(":")[1]
                  )
                );
                const endTime = new Date(
                  endDate.setHours(value.split(":")[0], value.split(":")[1])
                );

                if (startDate.toDateString() === endDate.toDateString()) {
                  return (
                    startTime < endTime ||
                    "On the same day, end time must be after start time"
                  );
                }
                return true;
              },
            })}
            type="time"
            className="mt-1 block w-full rounded-md border-second_background shadow-sm  focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
          />
          {errors.endTime && (
            <p className="text-red-500">{errors.endTime.message}</p>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Task Description</label>
        <textarea
          {...register("description", { required: "Description is required" })}
          className="mt-1 block w-full rounded-md border-second_background shadow-sm  focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="flex space-x-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium">Asset</label>
          <select
            {...register("assetId", { required: "Asset is required" })}
            className="mt-1 block w-full rounded-md border-second_background shadow-sm  focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
          >
            <option value="">Select an asset</option>
            {assets &&
              assets?.map((asset, index) => (
                <option key={index} value={asset._id}>
                  {asset.assetName}
                </option>
              ))}
          </select>
          {errors.assetId && (
            <p className="text-red-500">{errors.assetId.message}</p>
          )}
        </div>

        <div className="w-1/2">
          <label className="block text-sm font-medium">Location</label>
          <select
            {...register("roomId", { required: "Location is required" })}
            className="mt-1 block w-full rounded-md border-second_background shadow-sm  focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
          >
            <option value="">Select a location</option>
            {locations &&
              locations.map((location, index) => (
                <option key={index} value={location._id}>
                  {location.roomno}
                </option>
              ))}
            {/* Add more options as needed */}
          </select>
          {errors.roomId && (
            <p className="text-red-500">{errors.roomId.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Assignee</label>
        <select
          {...register("userId", { required: "Assignee is required" })}
          className="mt-1 block w-full rounded-md border-second_background shadow-sm  focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
        >
          <option value="">Select an assignee</option>
          {users &&
            users.map((user, index) => (
              <option key={index} value={user._id}>
                {user.name}
              </option>
            ))}
        </select>
        {errors.userId && (
          <p className="text-red-500">{errors.userId.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Task Priority</label>
        <select
          {...register("urgencyLevel", {
            required: "Task Priority is required",
          })}
          className="mt-1 block w-full rounded-md border-second_background shadow-sm  focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
        >
          <option value="">Select a priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        {errors.taskPriority && (
          <p className="text-red-500">{errors.taskPriority.message}</p>
        )}
      </div>

      <Button>Create Task</Button>
    </form>
  );
}

export default CreateTaskForm;
