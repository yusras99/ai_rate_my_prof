require("dotenv").config();
import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import { HfInference } from "@huggingface/inference";
import { database } from "../../../firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
  addDoc,
  updateDoc,
} from "firebase/firestore";

const systemPrompt = `
You are a rate my professor agent to help students find classes, that takes in user questions and answers them.
For every user question, the top 3 professors that match the user question are returned.
Use them to answer the question if needed.
`;
export async function POST(req) {
  try {
    const data = await req.json();
    // set up connections to Pinecone and OpenAI
    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
    const index = pc.index("rag").namespace("rmp-krishna");

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY, // Use process.env to access environment variables securely
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000/",
        "X-Title": "Rate My professors, AI",
      },
    });

    //userId: The unique ID of the user
    //message: the chat sent / received
    //senderType: who sent the message, either "user" or "chatbot"
    async function storeChatMessage(userID, message, senderType) {
      try {
        const userDocRef = await addDoc(collection(database, "chatHistory"), {
          userID: userID,
          message: message,
          senderType: senderType,
          timestamp: new Date(),
        });
        console.log("Message sent to firebase");
      } catch (error) {
        console.error("Message not sent to firebase", error);
      }
    }

    async function getChatHistory(userID) {
      try {
        const chatRef = collection(database, "chatHistory");
        const userQuery = query(chatCollectionRef, where("userID", "==", userID));
        const chatSnapshot = await getDocs(userQuery);
        const chatMessages = chatSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(`Chat history for user ${userID} retrieved from Firebase`, chatMessages);
        return chatMessages;
      } catch (error) {
        console.error(`Failed to retrieve chat history for user ${userID}`, error);
        return [];
      }
    }

    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
    // Extract the user’s question (the last msg)
    const user_query = data[data.length - 1].content;
    await storeChatMessage("user5", user_query, "user");
    // create an embedding of user's query
    const user_query_embedding = await hf.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: user_query,
    });

    // Use the embedding to find similar professor reviews in Pinecone
    const topMatches = await index.query({
      topK: 10, // how many results we need
      includeMetadata: true,
      vector: user_query_embedding,
    });

    // console.log("here", topMatches);

    const contexts = topMatches.matches.map((item) => item.metadata.text);
    const augmentedQuery = `<CONTEXT>\n${contexts
      .slice(0, 10)
      .join(
        "\n\n-------\n\n"
      )}\n-------\n</CONTEXT>\n\n\n\nMY QUESTION:\n${user_query}`;
    // console.log(augmentedQuery);

    // Combine the user’s question with the Pinecone results
    const lastDataWithoutLastMessage = data.slice(0, data.length - 1);

    // completion has the chatbot's response, the response is awaited and processed in chunks
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...lastDataWithoutLastMessage,
        { role: "user", content: augmentedQuery },
      ],
      model: "meta-llama/llama-3.1-8b-instruct:free", // Specify the model to use
      stream: true, // Enable streaming responses
    });
    // Create a ReadableStream to handle the streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of completion) {
            // content is the response of chatbots that are received as chunks
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              const text = encoder.encode(content);
              console.log(`content:${content}`);
              //  await storeChatMessage("user5", "Hi Firebase!", "user");
              controller.enqueue(text);
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });
    return new NextResponse(stream);
  } catch (error) {
    console.error("Error in POST /api/chat:", error); // Log the error for debugging
    return NextResponse.json({ error: error.message }, { status: 400 }); // Return a 400 Bad Request response with the error message
  }
}
