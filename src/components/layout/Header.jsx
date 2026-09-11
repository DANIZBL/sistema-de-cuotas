import "./Header.css";

function Header({ onMenuClick }) {
  return (
    <header className="admin-header">
      <button className="mobile-menu-button" onClick={onMenuClick}>
        ☰
      </button>

      <div>
        <h1>Productos</h1>
        <p>Gestioná los productos de tu empresa</p>
      </div>

      <div className="header-user">
        <div className="header-avatar">A</div>
      </div>
    </header>
  );
}

export default Header;
