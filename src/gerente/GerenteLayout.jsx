import { useState } from "react";
import { Outlet } from "react-router-dom";
import "../assets/css/dashboard.css";
import Navbar from "../components/header";
import Sidebar from "../components/menu";

export default function GerenteLayout() {
  const [isOpen, setIsOpen] = useState(false);
  // Mock user para el menú (role 1 = gerente)
  const user = { name: "Juan", role: 1, email: "juan@h2omanager.com" };
  const user2 = { name: "Eduar", role: 2, email: "eduar@gmail.com" };
  
  return (
    <div className="app-layout">
      <Sidebar
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        role={user.role}
      />
      <div
        className={`main-content ${isOpen ? "sidebar-open" : "sidebar-closed"}`}
      >
        <Navbar
          toggleSidebar={() => setIsOpen(!isOpen)}
          user={user}
          onLogout={() => {}}
        />
        <div className="dash-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
