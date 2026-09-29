import "./Sidebar.css";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

function Sidebar({ isOpen, onClose, currentPage, onNavigate }: SidebarProps) {
  function handleNavigate(page: string) {
    onNavigate(page);
    onClose();
  }

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

          <button
            className={`sidebar-item ${
              currentPage === "products" ? "active" : ""
            }`}
            onClick={() => handleNavigate("products")}
          >
            <span className="sidebar-icon">📦</span>
            Productos
          </button>

          <button
            className={`sidebar-item ${
              currentPage === "cuotas" ? "active" : ""
            }`}
            onClick={() => handleNavigate("cuotas")}
          >
            <span className="sidebar-icon">💳</span>
            Cuotas
          </button>

          <button
            className="sidebar-item"
            onClick={() => handleNavigate("clientes")}
          >
            <span className="sidebar-icon">👥</span>
            Clientes
          </button>

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
