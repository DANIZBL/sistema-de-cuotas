import { useEffect, useState } from "react";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

import Products from "./pages/Products";
import { Product, ProductApi } from "./components/products/types";

import Login from "./pages/Login/Login";

import "./App.css";
import { Route, Routes, useLocation, useNavigate } from "react-router";
import Categories from "./pages/Categories";
import Ordenes from "./pages/Cuotas/Ordenes";
import { ProductsContext } from "./lib/contexts";
import { User } from "./types/auth";
import { getProducts } from "./components/products/services/productService";

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

  const [products, setProducts] = useState<Product[]>([]);

  function handleLogin(loggedUser: User) {
    setUser(loggedUser);
    navigate("/productos")
  }

  useEffect(() => {
    if (user) {
      localStorage.setItem("adminUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("adminUser");
    }
  }, [user]);

  useEffect(() => {
    if (pathname != "/") {
      setSidebarOpen(false)
    }
  }, [pathname])

  useEffect(() => {
    (async () => {
      try {
        const response = await getProducts();;
        setProducts(response);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    })();
  }, []);

  return (
    <div className="admin-layout">
      {pathname != "/" &&
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      }

      <div className={`${pathname != "/" && "admin-main"}`}>
        {pathname != "/" &&
          <Header onMenuClick={() => setSidebarOpen(true)} />
        }
        <ProductsContext value={{ products, setProducts }}>
          <main className={`${pathname != "/" && "admin-content"}`}>
            <Routes>
              <Route path="/" element={<Login onLogin={handleLogin} />} />
              <Route path="/productos" element={<Products />} />
              <Route path="/categorias" element={<Categories />} />
              <Route path="/ordenes" element={<Ordenes />} />
            </Routes>
          </main>
        </ProductsContext>
      </div>
    </div>
  );
}

export default App;
