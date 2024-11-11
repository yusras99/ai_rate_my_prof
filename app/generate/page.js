"use client";

import React from "react";

// This is the page that takes you to actual chatbot;
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
} from "@mui/material";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import { firestore } from "@/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

const Generate = () => {
  // state for managing messages and user input
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi! I'm the Rate My Professor support assistant. How can I help you today?`,
    },
  ]);
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);

    const response = fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let result = "";

      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Uint8Array(), {
          stream: true,
        });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
        return reader.read().then(processText);
      });
    });
  };
  return (
    <Box
      sx={{
        my: 0,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#d9dde8",
        height: "100vh",
        gap: 5,
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
      <Stack
        direction={"column"}
        width="500px"
        height="700px"
        border="1px solid black"
        p={2}
        spacing={3}
      >
        <Stack
          direction={"column"}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === "assistant" ? "flex-start" : "flex-end"
              }
            >
              <Box
                bgcolor={
                  message.role === "assistant"
                    ? "primary.main"
                    : "secondary.main"
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction={"row"} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </Stack>
      </Stack>
      ;
    </Box>
  );
};

export default Generate;
