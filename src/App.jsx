import { useState } from "react";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Products from "./pages/Products";
import Login from "./pages/Login/Login";

import "./App.css";
import { Route, Routes } from "react-router";
import Categories from "./components/categories/Categories";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("adminUser");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem("adminUser");
      return null;
    }
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogin(loggedUser) {
    setUser(loggedUser);
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="admin-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="admin-content">
          <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/categorias" element={<Categories />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
