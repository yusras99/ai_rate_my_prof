import { useState } from "react";
import { Box, Button, TextField } from "@mui/material";

export default function SubmitProfessorForm() {
  const [link, setLink] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/submit_professor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ link }),
      });
      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={2}
      border="1px solid black"
      borderRadius="8px"
      maxWidth="400px"
      mx="auto"
    >
      <TextField
        label="Professor's Rate My Professor Link"
        fullWidth
        value={link}
        onChange={(e) => setLink(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Submit
      </Button>
    </Box>
  );
}
