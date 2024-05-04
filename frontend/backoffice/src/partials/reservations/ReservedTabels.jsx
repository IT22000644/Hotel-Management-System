import React, { useState, useEffect } from "react";
import Button from "../../components/Button";
import SearchBar from "../../components/SearchBar";
import axios from "axios";

const ReservedTables = () => {
  const [selectedTable, setSelectedTable] = useState("");
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/table")
      .then((response) => {
        setTables(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedTable) {
      axios
        .get(`http://localhost:5000/table-reservation/${selectedTable}`)
        .then((response) => {
          setReservations(response.data);
          console.log(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [selectedTable]);

  const handleView = (reservation) => {
    // Implement your view handling logic here
  };

  const handleCancel = (reservation) => {
    // Implement your cancel handling logic here
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto bg-background ">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold">Reserved Tables</h1>
        <SearchBar alignment="left" />
        <hr className="border-t border-second_background mt-3 mb-10" />

        <select
          className="mt-5 mb-10 block w-1/3 rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
        >
          {tables &&
            tables.map((table, index) => (
              <option key={index} value={table._id}>
                Table {table.number}
              </option>
            ))}
          {/* Add more options as needed */}
        </select>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-t border-second_background">
              <th className="py-4 px-6 bg-second_background">Reservation No</th>
              <th className="py-4 px-6 bg-second_background">Table No</th>
              <th className="py-4 px-6 bg-second_background">Customer Name</th>
              <th className="py-4 px-6 bg-second_background">Date</th>
              <th className="py-4 px-6 bg-second_background">Start Time</th>
              <th className="py-4 px-6 bg-second_background">End Time</th>
              <th className="py-4 px-6 bg-second_background">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr
                key={reservation._id}
                className="border-t border-second_background"
              >
                <td className="py-4 px-6">{reservation.reservationNumber}</td>
                <td className="py-4 px-6">{reservation.tableNumber.number}</td>
                <td className="py-4 px-6">{reservation.customerName}</td>
                <td className="py-4 px-6">{reservation.date}</td>
                <td className="py-4 px-6">
                  {new Date(reservation.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="py-4 px-6">
                  {new Date(reservation.endTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="py-4 px-6">
                  <Button onClick={() => handleView(reservation)}>View</Button>
                  <Button onClick={() => handleCancel(reservation)}>
                    Cancel
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservedTables;
