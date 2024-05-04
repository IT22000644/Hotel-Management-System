import { useState, useEffect } from "react";
import Button from "../../components/Button";
import axios from "axios";
import SearchBar from "../../components/SearchBar";
import Modal from "react-modal";
import { useForm } from "react-hook-form";

function AssetsTable() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({
    assetNo: "",
    assetName: "",
    image: null,
    lastServiceDate: "",
    status: "",
    location: "",
  });

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:5000/asset");
        setAssets(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, []);

  const handleCreateAsset = async (data) => {
    console.log(data);
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "image") {
        // append the File object, not the FileList
        formData.append(key, data[key][0]);
      } else {
        formData.append(key, data[key]);
      }
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/asset",
        formData
      );

      if (response.status === 201) {
        setModalOpen(false);
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReport = (id) => {
    console.log("Report asset with ID:", id);
  };

  const handleChange = (event) => {
    if (event.target.name === "image") {
      setNewAsset({ ...newAsset, image: event.target.files[0] });
    } else {
      setNewAsset({ ...newAsset, [event.target.name]: event.target.value });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Company Assets</h1>

      <SearchBar alignment="left" />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button onClick={() => setModalOpen(true)}>Create Asset</Button>
      </div>
      <hr className="border-t border-second_background mt-2 mb-12" />
      <table className="w-full text-left border-collapse">
        <thead className="border-t border-second_background">
          <tr className="bg-second_background">
            <th className="py-4 px-6">Asset code</th>
            <th className="py-4 px-6">Asset Name</th>
            <th className="py-4 px-6">Image</th>
            <th className="py-4 px-6">Last Service Date</th>
            <th className="py-4 px-6">Status</th>
            <th className="py-4 px-6">Location</th>
            <th className="py-4 px-6">Actions</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr
              key={asset.assetNo}
              className="border-t border-second_background"
            >
              <td className="py-4 px-6">{asset.assetCode}</td>
              <td className="py-4 px-6">{asset.assetName}</td>
              <td className="py-4 px-6">
                <img
                  src={`http://localhost:5000/uploads/asset/${asset.imageURL}`}
                  alt={asset.assetName}
                  onClick={() => window.open(asset.image, "_blank")}
                  style={{ cursor: "pointer" }}
                />
              </td>
              <td className="py-4 px-6">
                {new Date(asset.lastServiceDate).toLocaleDateString()}
              </td>
              <td className="py-4 px-6">{asset.status}</td>
              <td className="py-4 px-6">{asset.location}</td>
              <td className="py-4 px-6">
                <Button onClick={() => handleReport(asset._id)}>Report</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr className="border-t border-second_background mt-2 mb-12" />
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setModalOpen(false)}
        title="Create Asset"
        onConfirm={handleCreateAsset}
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
        <form onSubmit={handleSubmit(handleCreateAsset)}>
          <h1 className="text-2xl font-bold text-black">Create New Asset</h1>
          <hr className="border-t border-white mt-3 mb-6" />

          <div className="p-3">
            <label className="block text-sm font-medium">Asset No:</label>
            <input
              {...register("assetCode", { required: "Asset No is required" })}
              type="text"
              className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
            />
            {errors.assetNo && (
              <p className="text-red-500">{errors.assetNo.message}</p>
            )}
          </div>

          <div className="p-3">
            <label className="block text-sm font-medium">Asset Name:</label>
            <input
              {...register("assetName", { required: "Asset Name is required" })}
              type="text"
              className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
            />
            {errors.assetName && (
              <p className="text-red-500">{errors.assetName.message}</p>
            )}
          </div>

          <div className="p-3">
            <label className="block text-sm font-medium">Image:</label>
            <input
              {...register("image", { required: "Image is required" })}
              type="file"
              className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
            />
            {errors.image && (
              <p className="text-red-500">{errors.image.message}</p>
            )}
          </div>

          <div className="p-3">
            <label className="block text-sm font-medium">
              Last Service Date:
            </label>
            <input
              {...register("lastServiceDate", {
                required: "Last Service Date is required",
              })}
              type="date"
              className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
            />
            {errors.lastServiceDate && (
              <p className="text-red-500">{errors.lastServiceDate.message}</p>
            )}
          </div>

          <div className="p-3">
            <label className="block text-sm font-medium">Status:</label>
            <select
              {...register("status", { required: "Status is required" })}
              className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
            >
              <option value="">Select status</option>
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
              <option value="In Service">In Service</option>
              {/* Add more options as needed */}
            </select>
            {errors.status && (
              <p className="text-red-500">{errors.status.message}</p>
            )}
          </div>

          <div className="p-3">
            <label className="block text-sm font-medium">Location:</label>
            <select
              {...register("location", { required: "Location is required" })}
              className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
            >
              <option value="">Select location</option>
              <option value="Location 1">Location 1</option>
              <option value="Location 2">Location 2</option>
              <option value="Location 3">Location 3</option>
              {/* Add more options as needed */}
            </select>
            {errors.location && (
              <p className="text-red-500">{errors.location.message}</p>
            )}
          </div>

          <div className="p-3">
            <label className="block text-sm font-medium">
              Service Duration:
            </label>
            <input
              {...register("serviceDuration", {
                required: "Service Duration is required",
                min: { value: 1, message: "Duration must be larger than 0" },
              })}
              type="number"
              className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
              style={{ appearance: "textfield" }}
            />
            {errors.serviceDuration && (
              <p className="text-red-500">{errors.serviceDuration.message}</p>
            )}
          </div>

          <div className="p-3">
            <label className="block text-sm font-medium">Asset Type:</label>
            <select
              {...register("assetType", { required: "Asset Type is required" })}
              className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
            >
              <option value="">Select asset type</option>
              <option value="Electronic">Electronic</option>
              <option value="Furniture">Furniture</option>
              <option value="Other">Other</option>
              {/* Add more options as needed */}
            </select>
            {errors.assetType && (
              <p className="text-red-500">{errors.assetType.message}</p>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button type="submit" className="p-3 px-14">
              Save
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default AssetsTable;
