import { useState } from "react";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

import Products from "./pages/Products";
import Cuotas from "./pages/Cuotas/Cuotas";

import Login from "./pages/Login/Login";

import "./App.css";

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

  const [currentPage, setCurrentPage] = useState("products");

  function handleLogin(loggedUser) {
    setUser(loggedUser);
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  function renderPage() {
    switch (currentPage) {
      case "cuotas":
        return <Cuotas />;

      case "clientes":
        return (
          <div>
            <h1>Clientes</h1>
            <p>Esta sección la vamos a desarrollar próximamente.</p>
          </div>
        );

      case "products":
      default:
        return <Products />;
    }
  }

  return (
    <div className="admin-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />

      <div className="admin-main">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="admin-content">{renderPage()}</main>
      </div>
    </div>
  );
}

export default App;
