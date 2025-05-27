/** @format */

import { Paper, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";

const SearchBar = ({ searchQuery, setSearchQuery, handleSearch, t }) => {
  return (
    <Paper
      component="form"
      onSubmit={handleSearch}
      sx={{ ...searchBarStyle, flexGrow: 1, maxWidth: 600, }}
    >
      <IconButton type="submit" sx={searchBtnStyle}>
        <SearchIcon sx={{ color: "gray" }} />
      </IconButton>
      <InputBase
        sx={{ flex: 1, fontSize:14 }}
        placeholder={t("Search for anything")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </Paper>
  );
};

// CSS
const searchBarStyle = {
  p: "0px 0px",
  display: "flex",
  alignItems: "center",
  borderRadius: 999,
  border: "1px solid gray",
  "&:focus-within": {
    borderColor: "#8000ff",
  },
};

const searchBtnStyle = {
  backgroundColor: "transparent",
  borderRadius: "50%",
  p: 2,
  ml: 2,
  transition: "0.2s",
  "&:hover": {
    backgroundColor: "transparent",
  },
  "& .MuiSvgIcon-root": {
    color: "gray",
    transition: "color 0.3s",
  },
  "&:hover .MuiSvgIcon-root": {
    color: "black",
  },
};

export default SearchBar;