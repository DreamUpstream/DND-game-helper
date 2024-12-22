import React, { useState, useRef, useEffect } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageGenerator = () => {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const sliderRef = useRef(null);

  // Generate a new image and add it to the carousel
  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      const data = await response.json();
      const newImage = { url: data.imageUrl, description };

      // Add the new image if it doesn't already exist
      setImages((prev) => {
        if (!prev.some((img) => img.url === newImage.url)) {
          return [...prev, newImage]; // Append the new image
        }
        return prev; // Return the same array if duplicate
      });
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };

  // Move to the latest slide when a new image is added
  useEffect(() => {
    if (sliderRef.current && images.length > 0) {
      sliderRef.current.slickGoTo(images.length - 1); // Navigate to the last slide
    }
  }, [images]);

  const settings = {
    dots: true,
    infinite: false, // Optional, disable infinite loop
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Generate Dungeon Area Images
      </Typography>
      <TextField
        fullWidth
        label="Describe the area"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        variant="outlined"
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleGenerate}
        disabled={loading || !description}
      >
        Generate Image
      </Button>

      {loading && <Typography>Loading...</Typography>}

      {images.length > 0 && (
        <Box mt={4}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <Slider ref={sliderRef} {...settings}>
              {images.map((image, index) => (
                <div key={index} style={{ padding: "0 10px" }}>
                  <img
                    src={image.url}
                    alt={`Generated ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "10px",
                    }}
                  />
                  <p style={{ textAlign: "center" }}>{image.description}</p>
                </div>
              ))}
            </Slider>
          </div>
        </Box>
      )}
    </Box>
  );
};

export default ImageGenerator;
