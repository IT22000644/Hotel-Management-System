import React, { useState } from "react";
import Button from "../../components/Button";
import Select from "react-select";
import axios from "axios";

const AvailableTables = ({ tables, date, fromTime, toTime }) => {
  const [selectedTable, setSelectedTable] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");

  const customers = [
    { value: "663321729f6c8f8414d858de", label: "Customer 1" },
    { value: "663321729f6c8f8414d858de", label: "Customer 2" },
    { value: "663321729f6c8f8414d858de", label: "Customer 3" },
    // Add more customers as needed
  ];

  const handleReserve = () => {
    if (selectedTable && selectedCustomer) {
      const reservationRequest = {
        tableNumber: selectedTable,
        date: date,
        startTime: fromTime,
        endTime: toTime,
        customerID: selectedCustomer.value,
      };

      console.log("Reservation Request:", JSON.stringify(reservationRequest));

      // Code to reserve the selected table
      axios
        .post("http://localhost:5000/table-reservation", reservationRequest)
        .then((response) => {
          console.log(
            `Table ${selectedTable} reserved for customer ID ${selectedCustomer.value}.`
          );
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      console.log("No table or customer selected.");
    }
  };

  return (
    <div className=" flex flex-wrap justify-center">
      {tables.map((table, index) => (
        <div
          key={index}
          className="m-4 bg-button_color p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-xl font-bold text-white">Table {table.number}</h2>
          <p>Name: {table.name}</p>
          <p>Seating Capacity: {table.seatingCapacity}</p>
          <p className="font-semibold"> Available</p>
        </div>
      ))}

      <div className="w-full flex justify-center mt-5">
        <div className="w-1/2 flex justify-between">
          <Select
            className="w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
            options={customers}
            isSearchable
            placeholder="Select a customer"
            onChange={setSelectedCustomer}
            menuPortalTarget={document.body}
          />
          <select
            className="w-full ml-5 rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
          >
            <option value="">Select a table</option>
            {tables.map((table, index) => (
              <option key={index} value={table._id}>
                Table {table.number}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full flex justify-center mt-5">
        <Button onClick={handleReserve}>Reserve Table</Button>
      </div>
    </div>
  );
};

export default AvailableTables;
