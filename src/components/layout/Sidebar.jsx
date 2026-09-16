import { NavLink } from "react-router";
import "./Sidebar.css";

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">CA</div>

          <div>
            <h2>Cuotas Admin</h2>
            <span>Panel de administración</span>
          </div>

          <button className="sidebar-close" onClick={onClose}>
            ×
          </button>
        </div>

        <nav className="sidebar-nav">
          <p className="sidebar-section-title">GESTIÓN</p>

          <NavLink to={"/"}>
            {({ isActive }) => (
              <button className={`sidebar-item ${isActive ? "active" : ""}`}>
                <span className="sidebar-icon">📦</span>
                Productos
              </button>
            )}
          </NavLink>

          <NavLink to={"/categorias"}>
            {({ isActive }) => (
              <button className={`sidebar-item ${isActive ? "active" : ""}`}>
                <span className="sidebar-icon">📋</span>
                Categorías
              </button>
            )}
          </NavLink>

          <NavLink to={"/cuotas"}>
            {({ isActive }) => (
              <button className={`sidebar-item ${isActive ? "active" : ""}`}>
                <span className="sidebar-icon">💳</span>
                Cuotas
              </button>
            )}
          </NavLink>

          <NavLink to={"/clientes"}>
            {({ isActive }) => (
              <button className={`sidebar-item ${isActive ? "active" : ""}`}>
                <span className="sidebar-icon">👥</span>
                Clientes
              </button>
            )}
          </NavLink>

          <p className="sidebar-section-title">SISTEMA</p>

          <button className="sidebar-item">
            <span className="sidebar-icon">⚙️</span>
            Configuración
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-avatar">A</div>

          <div>
            <strong>Administrador</strong>
            <span>Cuenta principal</span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
