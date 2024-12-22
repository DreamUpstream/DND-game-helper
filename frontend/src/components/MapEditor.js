import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet"; // Import Leaflet for custom icons
import {
  Box,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from "@mui/material";
import axios from "axios";
import "leaflet/dist/leaflet.css";

const MapEditor = () => {
  const [assets, setAssets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [placedAssets, setPlacedAssets] = useState([]);

  const fetchAssets = async (query) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/fetch-assets?query=${query}`
      );
      setAssets(response.data);
    } catch (error) {
      console.error("Error fetching assets:", error.message);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchAssets(searchQuery);
    }
  };

  const handleMapClick = (event) => {
    if (selectedAsset) {
      setPlacedAssets((prev) => [
        ...prev,
        {
          ...selectedAsset,
          position: event.latlng,
          icon: L.icon({
            iconUrl: selectedAsset.imageUrl,
            iconSize: [32, 32],
          }),
        },
      ]);
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: handleMapClick,
    });
    return null;
  };

  return (
    <Box display="flex" height="100vh">
      {/* Sidebar for Searching and Selecting Assets */}
      <Box
        width="300px"
        p={2}
        bgcolor="grey.200"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Typography variant="h6" gutterBottom>
          Asset Library
        </Typography>
        <TextField
          label="Search for Assets"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          style={{ marginTop: "10px" }}
        >
          Search
        </Button>
        <List>
          {assets.map((asset, index) => (
            <ListItem
              key={index}
              button
              onClick={() => setSelectedAsset(asset)}
              selected={selectedAsset?.name === asset.name}
            >
              <Avatar src={asset.imageUrl} alt={asset.name} />
              <ListItemText primary={asset.name} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Map Display */}
      <Box flex={1}>
        <MapContainer
          center={[0, 0]}
          zoom={2}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <MapClickHandler />
          {placedAssets.map((asset, index) => (
            <Marker key={index} position={asset.position} icon={asset.icon} />
          ))}
        </MapContainer>
      </Box>
    </Box>
  );
};

export default MapEditor;
