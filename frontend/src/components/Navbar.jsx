import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Events", path: "/events" },
  { label: "Student Registration", path: "/my-registrations" },
  { label: "Admin", path: "/admin" },
  { label: "Notifications", path: "/notifications" },
  { label: "Results", path: "/results" },
];

export default function Navbar() {
  return (
    <nav className="main-navbar">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === "/"}
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}