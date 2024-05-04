import { useState } from "react";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import SearchBar from "../components/SearchBar";
import Button from "../components/Button";
import CreateMenus from "../partials/createMenus/CreateMenus";
import EditMenu from "../partials/createMenus/EditMenu";
import MenuTable from "../partials/createMenus/MenuTable";

const ManageMenu = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleCreate = () => {
    setCreateModalOpen(true);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto bg-background ">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h1 className="text-2xl font-bold">Manage Menus</h1>
              <SearchBar alignment="left" />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button className="px-6" onClick={handleCreate}>
                  Create Menu
                </Button>
              </div>
              <hr className="border-t border-second_background mt-2 mb-12" />
              <MenuTable />
              <CreateMenus />
              <EditMenu />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageMenu;
