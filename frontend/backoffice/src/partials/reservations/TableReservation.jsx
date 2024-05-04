import React, { useState } from "react";
import Button from "../../components/Button";
import AvailableTables from "./AvailableTabels";
import axios from "axios";
import PopUp from "../../components/PopUp";

const TableReservation = () => {
  const [date, setDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [tables, setTables] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const checkAvailability = async (e) => {
    e.preventDefault();

    await axios
      .get(
        `http://localhost:5000/table-reservation/time-range/${date}/${fromTime}/${toTime}`
      )
      .then((response) => {
        setTables(response.data);
        if (response.data.length > 0) {
          setShowPopup(true);
        } else {
          setPopupMessage("No available tables within the selected time.");
          setShowPopup(true);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto bg-background ">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold">Manage Reservation</h1>
        <hr className="border-t border-second_background mt-3 mb-10" />
        <form onSubmit={checkAvailability}>
          <div className="flex space-x-4">
            <div className="w-1/3">
              <label className="block mt-4">
                <span className="text-gray-700">Date</span>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>
            </div>

            <div className="w-1/3">
              <label className="block mt-4">
                <span className="text-gray-700">From</span>
                <input
                  type="time"
                  className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
                  value={fromTime}
                  onChange={(e) => setFromTime(e.target.value)}
                />
              </label>
            </div>
            <div className="w-1/3">
              <label className="block mt-4">
                <span className="text-gray-700">To</span>
                <input
                  type="time"
                  className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
                  value={toTime}
                  onChange={(e) => setToTime(e.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block mt-4">
                <span className="text-gray-700">Adult</span>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
                  value={adults}
                  onChange={(e) => setAdults(e.target.value)}
                />
              </label>
            </div>
            <div className="w-1/2">
              <label className="block mt-4">
                <span className="text-gray-700">Child</span>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-second_background shadow-sm focus:border-button_color focus:ring focus:ring-color focus:ring-opacity-5"
                  value={children}
                  onChange={(e) => setChildren(e.target.value)}
                />
              </label>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button className="mt-8 mb-5" type="submit">
              Check Availability
            </Button>
          </div>
        </form>
        {/* {showPopup && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <button onClick={() => setShowPopup(false)}>Close</button>
              <AvailableTables tables={tables} />
            </div>
          </div>
        )} */}
      </div>
      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <button onClick={() => setShowPopup(false)}>Close</button>
            {tables.length > 0 ? (
              <AvailableTables
                tables={tables}
                date={date}
                fromTime={fromTime}
                toTime={toTime}
              />
            ) : (
              <PopUp message={popupMessage} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TableReservation;
