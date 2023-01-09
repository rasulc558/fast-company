import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const NavProfile = () => {
  const { currentUser } = useAuth();
  const [show, setShow] = React.useState(false);

  const toggleMenu = () => {
    setShow((p) => !p);
  };

  return (
    <div className="dropdown" onClick={toggleMenu}>
      <div className="btn dropdown-toggle d-flex align-items-center me-2 justify-content-center">
        <div>{currentUser.name}</div>
        <img
          src={currentUser.image}
          alt=""
          className="img-fluid rounded-circle"
          height="40"
        />
      </div>

      <div className={"w-100 dropdown-menu " + (show ? "show" : "")}>
        <Link to={`/users/${currentUser._id}`} className="dropdown-item">
          Profile
        </Link>
        <Link to="/logout" className="dropdown-item">
          LogOut
        </Link>
      </div>
    </div>
  );
};

export default NavProfile;