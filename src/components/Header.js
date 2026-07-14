import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const logout = () => {
    localStorage.clear();

    enqueueSnackbar("Logged out successfully", {
      variant: "success",
    });

    history.push("/");
    window.location.reload();
  };

  const backToExplore = () => {
    history.push("/");
  };

  const goToRegister = () => {
    history.push("/register");
  };

  const goToLogin = () => {
    history.push("/login");
  };

  if (hasHiddenAuthButtons) {
    return (
      <Box className="header">
        <Box className="header-title">
          <img src="logo_light.svg" alt="QKart-icon" />
        </Box>

        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={backToExplore}
        >
          Back to explore
        </Button>
      </Box>
    );
  }

  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon" />
      </Box>

      {children}

      <Stack direction="row" spacing={1} alignItems="center">
        {localStorage.getItem("username") ? (
          <>
            <Avatar
              src="avatar.png"
              alt={localStorage.getItem("username")}
            />

            <p className="username-text">
              {localStorage.getItem("username")}
            </p>

            <Button onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button onClick={goToLogin}>
              Login
            </Button>

            <Button
              variant="contained"
              onClick={goToRegister}
            >
              Register
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default Header;