import React from "react";
import {
  Container,
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
  IconButton,
} from "@mui/material";
import { SignIn, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

export default function SignUpPage() {
  // ... (component body)
  return (
    <Box
      sx={{
        my: 0,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#d9dde8",
        height: "100vh",
      }}
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
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ textAlign: "center", my: 4, color: "black" }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Sign In
        </Typography>
        <SignIn />
      </Box>
    </Box>
  );
}
