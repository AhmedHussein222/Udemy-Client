import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useRef, useState } from "react";

const menuData = [
  {
    label: "Development",
    subcategories: [
      { label: "Web Development" },
      { label: "Data Science" },
      { label: "Mobile Apps" },
    ],
  },
  {
    label: "Business",
    subcategories: [{ label: "Finance" }, { label: "Entrepreneurship" }],
  },
  { label: "IT & Software" },
  { label: "Design" },
];

const ExploreMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState(null);
  const [submenuItems, setSubmenuItems] = useState([]);
  const closeTimer = useRef(null);

  // Open main menu
  const handleMenuOpen = (event) => {
    clearTimeout(closeTimer.current);
    setAnchorEl(event.currentTarget);
  };

  // Schedule closing of all menus
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => {
      setAnchorEl(null);
      setSubmenuAnchorEl(null);
      setSubmenuItems([]);
    }, 15000); // Delay before closing
  };

  // Clear scheduled close
  const cancelClose = () => {
    clearTimeout(closeTimer.current);
  };

  // Open submenu
  const handleSubmenuOpen = (event, subcategories) => {
    cancelClose();
    setSubmenuAnchorEl(event.currentTarget);
    setSubmenuItems(subcategories);
  };

  return (
    <div>
      <Button
        aria-controls={anchorEl ? "explore-menu" : undefined}
        aria-haspopup="true"
        onMouseEnter={handleMenuOpen}
        onMouseLeave={scheduleClose}
        style={{ zIndex: 1301 }}
      >
        Explore
      </Button>

      {/* Main Menu */}
      <Menu
        id="explore-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={scheduleClose}
        MenuListProps={{
          onMouseEnter: cancelClose,
          onMouseLeave: scheduleClose,
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          style: { minWidth: 180 },
        }}
      >
        {menuData.map((item) => (
          <MenuItem
            key={item.label}
            onMouseEnter={(e) => {
              setSubmenuItems([]);
              setSubmenuAnchorEl(null);
              if (item.subcategories) {
                handleSubmenuOpen(e, item.subcategories);
              }
            }}
            onMouseLeave={scheduleClose}
            onClick={() => setAnchorEl(null)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              minWidth: 180,
            }}
          >
            {item.label}
            {item.subcategories && <ArrowRightIcon fontSize="small" />}
          </MenuItem>
        ))}
      </Menu>

      {/* Sub Menu */}
      <Menu
        anchorEl={submenuAnchorEl}
        open={Boolean(submenuAnchorEl)}
        onClose={scheduleClose}
        MenuListProps={{
          onMouseEnter: cancelClose,
          onMouseLeave: scheduleClose,
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{ style: { pointerEvents: "auto", minWidth: 180 } }}
      >
        {submenuItems.map((sub) => (
          <MenuItem key={sub.label} onClick={() => setAnchorEl(null)}>
            {sub.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default ExploreMenu;
