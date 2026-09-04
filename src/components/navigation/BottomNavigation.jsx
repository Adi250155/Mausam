import { NavLink } from "react-router-dom";

function BottomNavigation() {
  const links = [
    {
      path: "/home",
      label: "Home",
      icon: "⌂",
    },
    {
      path: "/explore",
      label: "Explore",
      icon: "⌕",
    },
    {
      path: "/saved-locations",
      label: "Locations",
      icon: "⌖",
    },
    {
      path: "/alerts",
      label: "Alerts",
      icon: "⚠",
    },
    {
      path: "/profile",
      label: "Profile",
      icon: "◉",
    },
  ];

  return (
    <nav aria-label="Main navigation">
      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          end={link.path === "/home"}
        >
          <span aria-hidden="true">
            {link.icon}
          </span>

          <span>
            {link.label}
          </span>
        </NavLink>
      ))}
    </nav>
  );
}

export default BottomNavigation;