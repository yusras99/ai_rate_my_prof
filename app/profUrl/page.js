"use client";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  IconButton,
  TextField,
} from "@mui/material";
import { useState } from "react";
import Image from "next/image";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function url() {
  const [text, setText] = useState("");
  const router = useRouter();

  const handleGetStartedButtonClick = async () => {
    try {
      // Send a post request to the backend to send the url to it
      const response = await fetch("http://127.0.0.1:8000/get-prof-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: text }), //this converts the url to json string
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json(); // this is the response from the backend
      console.log(data);
      router.push("/generate");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChatHistoryButtonClick = async () => {
    try { }
    catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#d9dde8",
        height: "100%",
      }}
      alignItems="center"
    >
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#d9dde8",
        }}
      >
        <Toolbar>
          <a href="./">
            <IconButton
              sx={{
                transition: "box-shadow 0.3s ease",
                "&:hover": {
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                },
                padding: 0, // Remove padding to fit image
              }}
            >
              <Image
                src="/review_icon.png" // Path to your image in the public folder
                alt="Review Icon"
                width={50}
                height={50}
              />
            </IconButton>
          </a>
          <Typography
            variant={"h4"}
            color={"#000"}
            sx={{ flexGrow: 1, fontWeight: 800 }}
          >
            Professor Review Intel
          </Typography>
          <SignedOut>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Button
                variant="contained"
                sx={{
                  border: "4px solid #4255ff",
                  backgroundColor: "#4255ff", // Custom background color
                  color: "#FFFFFF", // Custom text color
                  "&:hover": {
                    backgroundColor: "#4255ff", // Custom hover background color
                  },
                }}
                href="/sign-in"
              >
                Login
              </Button>
              <Button
                color="inherit"
                variant="contained"
                sx={{
                  border: "4px solid #4255ff",
                  backgroundColor: "#4255ff", // Custom background color
                  color: "#FFFFFF", // Custom text color
                  "&:hover": {
                    backgroundColor: "#4255ff", // Custom hover background color
                  },
                }}
                href="/sign-up"
              >
                Sign Up
              </Button>
            </Box>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          border: "4px solid #000",
          backgroundColor: "black",
          my: 20, // a margin of 32px (4 * 8px) on both the top and bottom of the component
          height: "200px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 10,
          marginTop: "20vh",
          mx: "auto", // Centers horizontally in the viewport
        }}
      >
        <TextField
          label="Enter professor URL"
          variant="outlined"
          value={text}
          //   multiline
          rows={4}
          sx={{ my: 2, width: "1000px", height: "50px" }}
          onChange={(e) => setText(e.target.value)}
          InputProps={{
            style: {
              color: "#FFFFFF",
              backgroundColor: "#333",
              height: "40px",
            }, // Darker input field
          }}
          InputLabelProps={{
            style: { color: "#BBBBBB", height: "40px" }, // Light label color
          }}
        />
        <Button
          variant="contained"
          sx={{
            mb: 0,
            border: "4px solid #4255ff",
            width: "1000px",
            backgroundColor: "#4255ff", // Custom background color
            color: "#FFFFFF", // Custom text color
            "&:hover": {
              backgroundColor: "#4255ff", // Custom hover background color
            },
          }}
          onClick={handleGetStartedButtonClick}
        >
          Get Started
        </Button>
        <Button
          variant="contained"
          sx={{
            mb: 0,
            border: "4px solid #4255ff",
            width: "1000px",
            backgroundColor: "#4255ff", // Custom background color
            color: "#FFFFFF", // Custom text color
            "&:hover": {
              backgroundColor: "#4255ff", // Custom hover background color
            },
          }}
          onClick={handleChatHistoryButtonClick}
        >
          See Chat History
        </Button>
      </Box>
    </Box>
  );
}
