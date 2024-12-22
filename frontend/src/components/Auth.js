import React, { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { useUser } from "../contexts/UserContext";

const Auth = ({ mode }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Player");
  const { login } = useUser();

  const handleSubmit = async () => {
    const endpoint = mode === "register" ? "/auth/register" : "/auth/login";
    const body = { username, password, ...(mode === "register" && { role }) };

    try {
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.token) {
        login({ username, role: data.role });
        localStorage.setItem("token", data.token);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h4">
        {mode === "register" ? "Register" : "Login"}
      </Typography>
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />
      {mode === "register" && (
        <TextField
          select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          SelectProps={{ native: true }}
          label="Role"
          fullWidth
        >
          <option value="Player">Player</option>
          <option value="DM">Dungeon Master (DM)</option>
        </TextField>
      )}
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        {mode === "register" ? "Register" : "Login"}
      </Button>
    </Box>
  );
};

export default Auth;
