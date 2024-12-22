import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
} from "@mui/material";
import { useUser } from "./contexts/UserContext";
import ImageGenerator from "./components/ImageGenerator";
import MapEditor from "./components/MapEditor";
import SessionSummary from "./components/SessionSummary";
import Auth from "./components/Auth";

function App() {
  const { user, logout } = useUser();

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            D&D Session Tool
          </Typography>
          <Box>
            {user ? (
              <>
                <Link
                  to="/"
                  style={{
                    textDecoration: "none",
                    color: "white",
                    marginRight: "1rem",
                  }}
                >
                  Home
                </Link>
                {user.role === "DM" && (
                  <Link
                    to="/map-editor"
                    style={{
                      textDecoration: "none",
                      color: "white",
                      marginRight: "1rem",
                    }}
                  >
                    Map Editor
                  </Link>
                )}
                <Link
                  to="/session-summary"
                  style={{
                    textDecoration: "none",
                    color: "white",
                    marginRight: "1rem",
                  }}
                >
                  Session Summary
                </Link>
                <Button color="inherit" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    textDecoration: "none",
                    color: "white",
                    marginRight: "1rem",
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Register
                </Link>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Container sx={{ marginTop: "2rem" }}>
        <Routes>
          {!user ? (
            <>
              <Route path="/login" element={<Auth mode="login" />} />
              <Route path="/register" element={<Auth mode="register" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<ImageGenerator />} />
              {user.role === "DM" && (
                <Route path="/map-editor" element={<MapEditor />} />
              )}
              <Route path="/session-summary" element={<SessionSummary />} />
            </>
          )}
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
