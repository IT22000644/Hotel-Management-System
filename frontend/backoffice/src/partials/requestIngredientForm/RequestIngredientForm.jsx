import React, { useState } from "react";
import Button from "../../components/Button";

function RequestIngredientForm() {
  const [form, setForm] = useState({ product: "", quantity: "", unit: "" });
  const [items, setItems] = useState([]);
  const [errors, setErrors] = useState({});

  const handleInputChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setErrors({ ...errors, [event.target.name]: "" });
  };

  const handleAddItem = () => {
    let newErrors = {};

    // Validate form fields
    if (!form.product) newErrors.product = "Product is required";
    if (!form.quantity) newErrors.quantity = "Quantity is required";
    if (!form.unit) newErrors.unit = "Unit is required";

    if (Object.keys(newErrors).length > 0) {
      // If there are errors, update the state with them
      setErrors(newErrors);
    } else {
      // If no errors, add the item and clear the form
      setItems([...items, form]);
      setForm({ product: "", quantity: "", unit: "" });
    }
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((item, i) => i !== index));
  };

  const handleRequest = () => {
    // Send request to inventory here
    console.log("Request sent with items: ", items);
  };

  return (
    <>
      <div className="w-full bg-second_background rounded-xl shadow-lg overflow-hidden mb-5">
        <div className="md:flex-shrink-0 p-8 space-y-4">
          <div className="w-full">
            <label className="block text-sm font-medium">Product Name</label>
            <select
              name="product"
              value={form.product}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
            >
              <option value="">Select Product</option>
              <option value="Item 01">Item 01</option>
              <option value="Item 02">Item 02</option>
              <option value="Item 03">Item 03</option>
              <option value="Item 04">Item 04</option>
            </select>
            {errors.product && <p className="text-red-500">{errors.product}</p>}
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
              />
              {errors.quantity && (
                <p className="text-red-500">{errors.quantity}</p>
              )}
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium">Unit</label>
              <select
                name="unit"
                value={form.unit}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
              >
                <option value="">Select Unit</option>
                <option value="Nos">Nos</option>
                <option value="Kg">Kg</option>
                <option value="g">g</option>
                <option value="l">l</option>
                <option value="ml">ml</option>
              </select>
              {errors.unit && <p className="text-red-500">{errors.unit}</p>}
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Button onClick={handleAddItem}>Add Item</Button>
          </div>
        </div>
      </div>
      <div className="w-full bg-second_background rounded-xl shadow-lg overflow-hidden mb-5">
        <div className="md:flex-shrink-0 p-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 mb-4 flex justify-between items-center"
            >
              <span>
                {item.product} : {item.quantity} {item.unit}
              </span>
              <Button
                className="bg-main_color text-black"
                onClick={() => handleRemoveItem(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <div className="flex justify-center">
            <Button onClick={handleRequest}>Request</Button>
          </div>
        </div>
      </div>
    </>
  );
}
export default RequestIngredientForm;
