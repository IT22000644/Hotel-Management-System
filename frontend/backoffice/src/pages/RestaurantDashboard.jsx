import { useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import Dashboard from "../partials/restaurentDashboard/Dashboard";

const RestaurantDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto bg-background ">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <Dashboard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
