import { Link } from "react-router-dom";
export function NavBar() {
  const logout = (e:any) => {
    e.preventDefault();
    sessionStorage.removeItem("logged");
    window.location.reload();
  }
  return (
    <header>
      <div className="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">
        <Link className="d-flex align-items-center link-body-emphasis text-decoration-none" to="/">
          <img src="src/assets/logo.png" width="180px" alt="" />
        </Link>
        <nav className="d-inline-flex mt-2 mt-md-0 ms-md-auto">
          <Link className="me-3 py-2 link-body-emphasis text-decoration-none" to="/home">Home</Link>
          <Link className="me-3 py-2 link-body-emphasis text-decoration-none" to="/account-list">Accounts</Link>
          <div className="me-3 py-2 link-body-emphasis text-decoration-none">
            <Link className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" to="/">Transfer</Link>
            <ul className="dropdown-menu">
              <li>
                <Link className="dropdown-item" to="/recipient-list">Inter-transfer</Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/">Intra-transfer</Link>
              </li>
            </ul>
          </div>
          <Link className="me-3 py-2 link-body-emphasis text-decoration-none" onClick={logout} to="/">Logout</Link>
        </nav>
      </div>
    </header>
  );
}
