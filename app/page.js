"use client";

import {
  AppBar,
  Box,
  Button,
  Stack,
  TextField,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Grid,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn } = useAuth();
  // Generate button will take you to generate page only if you are signed in
  const href = isSignedIn ? "/generate" : "/sign-in";

  return (
    // Layout of main page
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

      {/* Hero Section */}
      <Container
        sx={{
          textAlign: "center",
          my: 4,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          alignItems: "center",
          backgroundColor: "#fff",
          padding: "12px",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontFamily: `'Mont Hairline', italic`,
            fontWeight: "600",
            fontStyle: "normal",
            textShadow: "6px 6px 6px #0000",
            color: "black",
          }}
        >
          Join us to filter, compare, and choose the right professor for your
          educational needs.
        </Typography>

        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontFamily: `'Mont Hairline', italic`,
            fontWeight: "500",
            fontStyle: "normal",
            textShadow: "6px 6px 6px #0000",
            color: "black",
          }}
        >
          Empowering You to Choose the Right Professor for Success
        </Typography>

        <Button
          variant="contained"
          sx={{
            border: "3px solid #4255ff",
            backgroundColor: "#4255ff",
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: "#4255ff",
            },
          }}
          href={href}
        >
          Get Started
        </Button>
      </Container>

      {/* Feature Section */}
      {/* This section highlights the key features of the application, using a grid layout to display them. */}
      <Container
        sx={{
          my: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Box sx={{ marginBottom: "50px" }}>
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            alignItems="center"
            sx={{
              fontFamily: `'Mont Hairline', italic`,
              fontWeight: 400,
              textShadow: "6px 6px 6px #d9dde8",
              color: "black",
            }}
          >
            Features we offer:
          </Typography>
        </Box>
        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="center" // Center items vertically within the grid
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <Grid item xs={12} sm={6} md={4}>
            <CreateIcon sx={{ color: "#000", fontSize: 50 }} />
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 400, color: "#000" }} // black color for the text
            >
              Smart Professor Review Search
            </Typography>
            <Typography color="black">
              Type in your query or professor’s name, and the app searches its
              database to fetch the most pertinent reviews and ratings.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <CreateIcon sx={{ color: "#000", fontSize: 50 }} />
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 400, color: "#000" }} // black color for the text
            >
              Interactive Chatbot Assistance
            </Typography>
            <Typography color="black">
              The chatbot has the ability to understand and respond to your
              inquiries. It can handle various types of questions and follow-up
              for more specific information if needed.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <CreateIcon sx={{ color: "#000", fontSize: 50 }} />
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 400, color: "#000" }} // black color for the text
            >
              Customizable Review Filters
            </Typography>
            <Typography color="black">
              Users can select various filters (e.g., star rating, course name)
              and apply them to their search. The app then updates the review
              results to match the selected criteria.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
