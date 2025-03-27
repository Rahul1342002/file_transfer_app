import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "10px", background: "#282c34", color: "white" }}>
      <h2>File Transfer App</h2>
      <div>
        <Link to="/" style={{ margin: "10px", color: "white", textDecoration: "none" }}>
          Home
        </Link>
        <Link to="/send" style={{ margin: "10px", color: "white", textDecoration: "none" }}>
          Send
        </Link>
        <Link to="/receive" style={{ margin: "10px", color: "white", textDecoration: "none" }}>
          Receive
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
