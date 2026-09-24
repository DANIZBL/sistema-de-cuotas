import { useState } from "react";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Products from "./pages/Products";
import Login from "./pages/Login/Login";

import "./App.css";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import Categories from "./pages/Categories";

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

  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogin(loggedUser) {
    setUser(loggedUser);
    navigate("/productos")
  }

  return (
    <div className="admin-layout">
      {pathname != "/" &&
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      }

      <div className="admin-main">
        {pathname != "/" &&
          <Header onMenuClick={() => setSidebarOpen(true)} />
        }
        <main className={`${pathname != "/" && "admin-content"}`}>
          <Routes>
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            <Route path="/productos" element={<Products />} />
            <Route path="/categorias" element={<Categories />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
