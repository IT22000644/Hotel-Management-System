import { useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import SearchBar from "../components/SearchBar";
import TableReservations from "../partials/reservations/TableReservation";
import ReservedTables from "../partials/reservations/ReservedTabels";

const ManageReservations = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main>
          <TableReservations />
          <ReservedTables />
        </main>
      </div>
    </div>
  );
};

export default ManageReservations;
