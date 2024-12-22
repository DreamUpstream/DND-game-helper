import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";

const SessionSummary = () => {
  const sessionData = JSON.parse(localStorage.getItem("sessionData")) || [];

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(sessionData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "session_data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Session Summary
      </Typography>
      <List>
        {sessionData.map((item, index) => (
          <ListItem key={index}>
            <ListItemText primary={item.description} />
          </ListItem>
        ))}
      </List>
      <Button variant="contained" color="secondary" onClick={handleExport}>
        Export Session Data
      </Button>
    </Box>
  );
};

export default SessionSummary;
