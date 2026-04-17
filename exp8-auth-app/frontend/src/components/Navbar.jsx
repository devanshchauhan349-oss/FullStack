import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ isAuthenticated, user, setIsAuthenticated, setUser }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/");
  };

  return (
    <nav style={{ padding: "10px", background: "#eee" }}>
      <Link to="/" style={{ marginRight: "10px" }}>Login</Link>

      {isAuthenticated && (
        <>
          <Link to="/dashboard" style={{ marginRight: "10px" }}>Dashboard</Link>
          {user?.role === "admin" && (
            <Link to="/admin" style={{ marginRight: "10px" }}>Admin</Link>
          )}
          <button onClick={logout}>Logout</button>
        </>
      )}
    </nav>
  );
}