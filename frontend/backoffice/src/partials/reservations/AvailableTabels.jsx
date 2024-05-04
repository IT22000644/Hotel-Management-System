import React from "react";

const AvailableTables = ({ tables }) => {
  return (
    <div className="flex flex-wrap justify-center">
      {tables.map((table, index) => (
        <div
          key={index}
          className="m-4 bg-button_color p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-xl font-bold">Table {table.number}</h2>
          <p>Name: {table.name}</p>
          <p>Seating Capacity: {table.seatingCapacity}</p>
          <p className="font-semibold"> Available</p>
        </div>
      ))}
    </div>
  );
};

export default AvailableTables;
